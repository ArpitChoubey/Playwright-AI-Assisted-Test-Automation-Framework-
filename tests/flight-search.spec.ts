import { test, expect, Page } from '@playwright/test'

async function clickFirstAvailable(page: Page, selectors: string[]) {
  for (const sel of selectors) {
    const loc = page.locator(sel)
    if (await loc.count() > 0) {
      try {
        await loc.first().waitFor({ state: 'visible', timeout: 3000 })
        await loc.first().click({ force: true })
        return true
      } catch {}
    }
  }
  return false
}

async function fillAutocomplete(page: Page, candidateSelectors: string[], value: string) {
  for (const sel of candidateSelectors) {
    const loc = page.locator(sel)
    try {
      await loc.first().waitFor({ state: 'visible', timeout: 2000 })
      await loc.first().fill(value)
      await page.waitForTimeout(500)
      await page.keyboard.press('ArrowDown')
      await page.keyboard.press('Enter')
      return true
    } catch {}
  }
  for (const sel of candidateSelectors) {
    try {
      const exists = await page.locator(sel).count()
      if (exists) {
        await page.locator(sel).first().evaluate((el, val) => {
          ;(el as HTMLInputElement).value = val
          el.dispatchEvent(new Event('input', { bubbles: true }))
        }, value)
        return true
      }
    } catch {}
  }
  return false
}

async function setDateInput(page: Page, candidateSelectors: string[], dateIso: string) {
  for (const sel of candidateSelectors) {
    const loc = page.locator(sel)
    try {
      await loc.first().waitFor({ state: 'attached', timeout: 1500 })
      await loc.first().evaluate((el, val) => { (el as HTMLInputElement).value = val; el.dispatchEvent(new Event('change', { bubbles: true })); }, dateIso)
      return true
    } catch {}
  }
  try {
    const dateInput = page.locator('input[type="date"]').first()
    if (await dateInput.count() > 0) {
      await dateInput.evaluate((el, val) => { (el as HTMLInputElement).value = val; el.dispatchEvent(new Event('change', { bubbles: true })); }, dateIso)
      return true
    }
  } catch {}
  return false
}

test.describe('Flight Search - flyingrules.com', () => {
  test('Round-trip search for 2 travelers, economy', async ({ page }) => {
    page.on('console', msg => console.log('PAGE LOG:', msg.text()))
    try {
      await page.goto('https://flyingrules.com', { waitUntil: 'networkidle', timeout: 30000 })
    } catch (err) {
      console.error('Navigation to https://flyingrules.com failed:', err)
      throw err
    }

    const searchSection = page.locator('text=Search Flights').first()
    await expect(searchSection).toBeVisible({ timeout: 8000 })

    await clickFirstAvailable(page, [
      'text=Round Trip',
      'label:has-text("Round Trip")',
      'input[value="roundtrip"]',
      'input[name*="trip"][value*="round"]'
    ])

    await clickFirstAvailable(page, [
      'text=2 Traveler',
      'text=2 Travelers',
      'select[name*="passengers"]',
      'select#passengers'
    ])

    const travelerSelect = page.locator('select[name*="passengers"]').first()
    if (await travelerSelect.count() > 0) {
      try { await travelerSelect.selectOption({ value: '2' }) } catch {}
    }

    await clickFirstAvailable(page, [
      'text=Economy Class',
      'label:has-text("Economy")',
      'select[name*="cabin"]'
    ])

    const cabinSelect = page.locator('select[name*="cabin"]').first()
    if (await cabinSelect.count() > 0) {
      try { await cabinSelect.selectOption({ label: /Economy/i }) } catch {}
    }

    await fillAutocomplete(page, [
      'input[placeholder*="From"]',
      'input[name*="from"]',
      'input[id*="from"]',
      'input[aria-label*="From"]'
    ], 'LHR London, United Kingdom')

    await fillAutocomplete(page, [
      'input[placeholder*="To"]',
      'input[name*="to"]',
      'input[id*="to"]',
      'input[aria-label*="To"]'
    ], 'JFK New York, United States')

    await setDateInput(page, [
      'input[placeholder*="Depart"]',
      'input[name*="departure"]',
      'input[id*="departure"]'
    ], '2026-03-28')

    await setDateInput(page, [
      'input[placeholder*="Return"]',
      'input[name*="return"]',
      'input[id*="return"]'
    ], '2026-04-11')

    let clicked = await clickFirstAvailable(page, [
      'button:has-text("Search Flights")',
      'a:has-text("Search Flights")',
      'button[type="submit"]',
      'input[type="submit"][value*="Search"]',
      'button[class*="search"]',
      'text=Find Flights',
      'text=Find'
    ])
    if (!clicked) {
      // fallback: press Enter in the focused element
      try {
        await page.keyboard.press('Enter')
        await page.waitForTimeout(500)
        clicked = true
      } catch {}
    }
    if (!clicked) {
      // fallback: submit first form on page
      try {
        await page.locator('form').first().evaluate((f: HTMLFormElement) => f.submit())
        await page.waitForTimeout(500)
        clicked = true
      } catch {}
    }
    if (!clicked) {
      const html = await page.content()
      console.error('Could not find Search Flights button. Page HTML snippet:\n', html.slice(0, 3000))
      throw new Error('Could not find Search Flights button')
    }

    const urlPromise = page.waitForURL(/(search|results|flights)/i, { timeout: 12000 }).catch(() => null)
    const resultsPromise = page.waitForSelector('.results, [data-test="results"], text=Select flight, text=Flight results', { timeout: 12000 }).catch(() => null)
    const [urlRes, resultsRes] = await Promise.all([urlPromise, resultsPromise])
    if (!urlRes && !resultsRes) throw new Error('Search did not navigate to results or show results within timeout')

    expect(urlRes || resultsRes).toBeTruthy()
  })
})
