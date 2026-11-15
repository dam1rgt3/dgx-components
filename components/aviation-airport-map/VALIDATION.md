# Validation — OpenStreetMap edition

Passed automated checks for OSM tile URL, attribution, Referer setting, zoom range 2–19, removal of simplified geometry, airport identity and route endpoints, geographic bounds of the decorative connection, continuous heading, constant speed (under 0.2% sampled variation), and standalone JavaScript parsing.

Full build, live tile loading, and browser visual/interaction tests have NOT been verified in the authoring environment: package and network access were unavailable. The ChatGPT HTML preview previously blocked or failed OSM tile loads. Validate on a hosted Lovable URL before publishing.

Acceptance checks: real map tiles visible; zoom out to world and in to streets; both airport markers select correctly; plane turns smoothly; Pause and reduced-motion work; keyboard activation and mobile layout work; unmount/remount creates no duplicate map.
