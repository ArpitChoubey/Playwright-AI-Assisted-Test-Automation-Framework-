import { Page, expect } from '@playwright/test'

export class FlightSearchPage {
  readonly page: Page
  constructor(page: Page) { this.page = page }

  private async clickFirstAvailable(selectors: string[]) {
    for (const sel of selectors) {
      const loc = this.page.locator(sel)
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

  private async fillAutocomplete(candidateSelectors: string[], value: string) {
    for (const sel of candidateSelectors) {
      const loc = this.page.locator(sel)
      try {
        await loc.first().waitFor({ state: 'visible', timeout: 2000 })
        await loc.first().fill(value)
        await this.page.waitForTimeout(500)
        await this.page.keyboard.press('ArrowDown')
        await this.page.keyboard.press('Enter')
        return true
      } catch {}
    }
    for (const sel of candidateSelectors) {
      try {
        const exists = await this.page.locator(sel).count()
        if (exists) {
          await this.page.locator(sel).first().evaluate((el, val) => {
            ;(el as HTMLInputElement).value = val
            el.dispatchEvent(new Event('input', { bubbles: true }))
          }, value)
          return true
        }
      } catch {}
    }
    return false
  }

  private async setDateInput(candidateSelectors: string[], dateIso: string) {
    for (const sel of candidateSelectors) {
      const loc = this.page.locator(sel)
      try {
        await loc.first().waitFor({ state: 'attached', timeout: 1500 })
        await loc.first().evaluate((el, val) => { (el as HTMLInputElement).value = val; el.dispatchEvent(new Event('change', { bubbles: true })); }, dateIso)
        return true
      } catch {}
    }
    try {
      const dateInput = this.page.locator('input[type="date"]').first()
      if (await dateInput.count() > 0) {
        await dateInput.evaluate((el, val) => { (el as HTMLInputElement).value = val; el.dispatchEvent(new Event('change', { bubbles: true })); }, dateIso)
        return true
      }
    } catch {}
    return false
  }

  async goto() {
    await this.page.goto('https://flyingrules.com', { waitUntil: 'networkidle', timeout: 30000 })
  }

  async expectSearchSectionVisible() {
    const searchSection = this.page.locator('text=Search Flights').first()
    await expect(searchSection).toBeVisible({ timeout: 8000 })
  }

  async selectRoundTrip() {
    await this.clickFirstAvailable([
      'text=Round Trip',
      'label:has-text("Round Trip")',
      'input[value="roundtrip"]',
      'input[name*="trip"][value*="round"]'
    ])
  }

  async selectPassengers(count: number) {
    await this.clickFirstAvailable([
      'text=2 Traveler',
      'text=2 Travelers',
      'select[name*="passengers"]',
      'select#passengers'
    ])
    const travelerSelect = this.page.locator('select[name*="passengers"]').first()
    if (await travelerSelect.count() > 0) {
      try { await travelerSelect.selectOption({ value: String(count) }) } catch {}
    }
  }

  async selectCabin(label = 'Economy') {
    await this.clickFirstAvailable([
      'text=Economy Class',
      'label:has-text("Economy")',
      'select[name*="cabin"]'
    ])
    const cabinSelect = this.page.locator('select[name*="cabin"]').first()
    if (await cabinSelect.count() > 0) {
      try { await cabinSelect.selectOption({ label: new RegExp(label, 'i') as any }) } catch {}
    }
  }

  async fillFrom(value: string) {
    await this.fillAutocomplete(this.fromCandidates(), value)
  }

  async fillTo(value: string) {
    await this.fillAutocomplete(this.toCandidates(), value)
  }

  private fromCandidates() {
    return [
      'input[placeholder*="From"]',
      'input[name*="from"]',
      'input[id*="from"]',
      'input[aria-label*="From"]'
    ]
  }

  private toCandidates() {
    return [
      'input[placeholder*="To"]',
      'input[name*="to"]',
      'input[id*="to"]',
      'input[aria-label*="To"]'
    ]
  }

  async setDeparture(dateIso: string) {
    return this.setDateInput([
      'input[placeholder*="Depart"]',
      'input[name*="departure"]',
      'input[id*="departure"]'
    ], dateIso)
  }

  async setReturn(dateIso: string) {
    return this.setDateInput([
      'input[placeholder*="Return"]',
      'input[name*="return"]',
      'input[id*="return"]'
    ], dateIso)
  }

  async clickSearch() {
    let clicked = await this.clickFirstAvailable([
      'button:has-text("Search Flights")',
      'a:has-text("Search Flights")',
      'button[type="submit"]',
      'input[type="submit"][value*="Search"]',
      'button[class*="search"]',
      'text=Find Flights',
      'text=Find'
    ])
    if (!clicked) {
      try { await this.page.keyboard.press('Enter'); await this.page.waitForTimeout(500); clicked = true } catch {}
    }
    if (!clicked) {
      try { await this.page.locator('form').first().evaluate((f: HTMLFormElement) => f.submit()); await this.page.waitForTimeout(500); clicked = true } catch {}
    }
    if (!clicked) throw new Error('Could not find or click Search button')
  }

  async waitForResults(timeout = 12000) {
    const urlPromise = this.page.waitForURL(/(search|results|flights)/i, { timeout }).catch(() => null)
    const resultsPromise = this.page.waitForSelector('.results, [data-test="results"], text=Select flight, text=Flight results', { timeout }).catch(() => null)
    const [urlRes, resultsRes] = await Promise.all([urlPromise, resultsPromise])
    if (!urlRes && !resultsRes) throw new Error('Search did not navigate to results or show results within timeout')
    return urlRes || resultsRes
  }
}
