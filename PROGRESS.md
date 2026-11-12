# Trends implementation

## Requirements
- Add a Trends tab for the selected keyboard, with volume, character and physical workload over time.
- Support persistent range, grouping and chart selections; missing recorded days are gaps, not zeroes.
- Reuse the existing decoding, printing and physical-assignment rules. Aggregate by bucket, not with one request per day.
- Preserve the existing observed and comparison views. Keep the implementation focused and simple.

## Progress
- Added a date-normalized aggregate query and Trends endpoint using the existing projection counting rules.
- Added Recharts as a locally bundled client dependency.
- Added the lazy-loaded Trends tab, range/group/activity controls, persistent series preferences, linked charts, bucket inspection and refresh/retry handling.
- Added tests for missing days, mixed date formats, grouping, shortcut denominators and estimated modifiers. Extended the browser smoke test for Trends and mobile layout.
- Verified typecheck, 57 unit tests, client build and browser smoke test. A read-only local endpoint check against keyboard 343 returned a 69 KB all-history response in approximately 0.65 seconds.
- Rebuilt the packaged application and reloaded the service. Verified the page and Trends API both return HTTP 200.
- Fixed a chart-related SVG selector specificity regression that shrank comparison keyboards to icon size; added a browser size assertion.
- Changed finger workload trends to stacked areas, retaining the selected categories, count/share modes and missing-data gaps. Verified typecheck, client build and browser smoke test, including a gap and category selection.
- Rebuilt the packaged application and reloaded the service with the stacked-area change; verified the page returns HTTP 200.
- Replaced the shifting character grid with a compact searchable picker and stable selection legend. Added historical named-key series, including Backspace, and a common decoded-action share denominator.
- Verified 58 unit tests, typecheck, packaged build and browser smoke tests, including picker stability. Reloaded the service and confirmed Backspace is present in the live Trends API.

## Pending
- None.

## Limitations
- The charts interpret historic actions using the existing macOS French decoder and current physical assignments; missing days and modifier holds cannot be reconstructed.
- The client build now targets browsers with ES2020 and native dynamic-import support to keep the chart library in a separate on-demand chunk.
