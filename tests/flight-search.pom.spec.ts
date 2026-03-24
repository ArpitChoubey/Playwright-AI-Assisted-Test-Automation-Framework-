import { test } from '@playwright/test'
import { FlightSearchPage } from './pages/flightSearchPage'

test('Round-trip search for 2 travelers, economy - POM', async ({ page }) => {
  const fp = new FlightSearchPage(page)
  await fp.goto()
  await fp.expectSearchSectionVisible()
  await fp.selectRoundTrip()
  await fp.selectPassengers(2)
  await fp.selectCabin('Economy')
  await fp.fillFrom('LHR London, United Kingdom')
  await fp.fillTo('JFK New York, United States')
  await fp.setDeparture('2026-03-28')
  await fp.setReturn('2026-04-11')
  await fp.clickSearch()
  await fp.waitForResults()
})
