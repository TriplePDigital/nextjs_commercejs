
<a name="v1.2.0"></a>
## [v1.2.0](https://github.com/TriplePDigital/nextjs_commercejs/compare/v1.1.0...v1.2.0) (2022-10-11)

### Pull Requests

* Merge pull request [#54](https://github.com/TriplePDigital/nextjs_commercejs/issues/54) from TriplePDigital/dev


<a name="v1.1.0"></a>
## [v1.1.0](https://github.com/TriplePDigital/nextjs_commercejs/compare/v1.0.2...v1.1.0) (2022-09-18)

### Chore

* :rotating_light: Changed whitespacing on prettier
* :bookmark: Changed project version to mach github tags
* :wrench: Updated prettier config

### Feat

* ✨ Added multiple choice option for quizzes
* **mission:** :sparkles: Added routing to fallback URLs if present

### Fix

* **auth:** :passport_control: Fixed SSR not returning in edge case scenario
* **mission:** :ambulance: Hotfix bug for edge case scenario

### Refactor

* ♻️ Applied changes made by prettier
* **MMP:** ♻️ Lifted the Admin Sidebar out of pages into the Layout

### Test

* **test:** ✅ Added Cypress for testing the application

### Pull Requests

* Merge pull request [#48](https://github.com/TriplePDigital/nextjs_commercejs/issues/48) from TriplePDigital/dev
* Merge pull request [#47](https://github.com/TriplePDigital/nextjs_commercejs/issues/47) from TriplePDigital/dev


<a name="v1.0.2"></a>
## [v1.0.2](https://github.com/TriplePDigital/nextjs_commercejs/compare/v1.0.1...v1.0.2) (2022-08-16)

### Feat

* :lipstick: User enrollments open into modals in table
* :sparkles: Configured toast notifications
* **MMP:** :sparkles: Finished the quiz upload wizard
* **user:** :sparkles: Started working on RM Proficiency Matrix

### Fix

* :bug: Removed vimeo rec videos display after video ended
* **mission:** :bug: Fixed quiz result to course redirecting

### Pull Requests

* Merge pull request [#46](https://github.com/TriplePDigital/nextjs_commercejs/issues/46) from TriplePDigital/dev
* Merge pull request [#45](https://github.com/TriplePDigital/nextjs_commercejs/issues/45) from TriplePDigital/dev
* Merge pull request [#43](https://github.com/TriplePDigital/nextjs_commercejs/issues/43) from TriplePDigital/dev


<a name="v1.0.1"></a>
## [v1.0.1](https://github.com/TriplePDigital/nextjs_commercejs/compare/v1.0.0...v1.0.1) (2022-07-26)

### Ci

* :arrow_up: Upgraded Sentry version

### Feat

* :boom: Changed duration to come from vimeo rather then field input
* :dizzy: Added step by step quiz creation for better UX
* :sparkles: Added Quiz bulk upload functionality
* **MMP:** :art: Turned state based routing into URL query based
* **mission:** :sparkles: Made course landing page count number of checkpoints and sum duration

### Fix

* :fire: Removed fallback alert when no chapters are present

### Perf

* :art: Moved admin sidebar to a seperate component


<a name="v1.0.0"></a>
## v1.0.0 (2022-07-21)

### Chore

* :green_heart: Worked further on Sentry release tagging
* :green_heart: Added release tagging to Sentry
* :art: Minor prettier changes
* **general:** 🧹 Removed old Quiz component

### Ci

* :green_heart: Worked on Sentry things...

### Feat

* :boom: Modified fetch helper functions
* :art: Added options parameter to sanity image constructor
* :adhesive_bandage: Added dropdown for logout and user profile link
* :bug: Implemented checkpoint progress tracking
* :sparkles: Created basic user profile for instructors
* :sparkles: Added instructor profile logic & script
* :sparkles: Added dynamic SMTP for different envs
* :sparkles: Created Quiz results page
* :bug: Added alert about upcoming courses for error management
* :sparkles: Added stage count field within missions for UI logic
* :lipstick: Added visual Membership support
* :truck: Created error pages
* **MMP:** :sparkles: Created aditional pages for the MMP
* **MMP:** :sparkles: Added quiz reporting to MMP
* **MMP:** :sparkles: Added enrollment reporting to MMP
* **MMP:** :sparkles: Started working on MMP
* **mission:** :necktie: Moved dynamic course content into a separate component
* **mission:** :sparkles: Tracking video progress implemented
* **mission:** :adhesive_bandage: Added instructor email under their name
* **quiz:** :sparkles: Made quiz results page prettier

### Fix

* :bug: Added safeguards for missing API fields or null values
* :rotating_light: Fixed lint warnings and deploy blockers
* :bug: Fixed CORS issue when fetching
* :adhesive_bandage: Added safety guards to prevent render of empty array
* :bug: Tried fixing the sessions error on login bug
* :bug: Fixed link issue with course cards
* :art: Modified the email template we send on login attempt
* :alien: Modified queries due to API change
* :bug: Fixed the video duration rendering bug
* :lipstick: Added minor styling to pages
* :bug: Fixed broken certification mapping
* :zap: Add CND and prod DB fetching for prod deploy
* :bug: Change redirect destination after login
* :bug: Change method to switch to quizzes
* **auth:** :passport_control: Worked on authentiaction and redirection based on session
* **auth:** :passport_control: Worked on background auth services
* **auth:** :passport_control: Worked more on email authentication
* **auth:** :passport_control: Worked on emails not sending on login
* **auth:** :passport_control: Fixing welcome page redirection and login flow
* **auth:** :passport_control: Fixed callback URL
* **auth:** :passport_control: Active profiles skip welcome from SSR
* **auth:** :bug: Fixed misc auth related bugs
* **auth:** :bug: Fixed localhost references in auth flow
* **auth:** :bug: Fixed auth routing
* **auth:** :bug: Hopefully fixed some weird auth issues
* **mission:** :ambulance: Fixed fallback variable value
* **mission:** :sparkles: Created a landing page for not-enrolled courses

### Refactor

* :bug: Removed broken nav links
* :passport_control: Removed Google Auth for the time being
* :art: Changed missions page to match data provided
* :art: Modified helper functions and hooks

### Style

* :recycle: Minor whitespace and comment removals
* :lipstick: Minor style changes
* :lipstick: Added BETA release warning
* :lipstick: Added hover state styling to tabs
* :lipstick: Minor responsivness issues addressed
* :rotating_light: Fixed eslint warnings

### Pull Requests

* Merge pull request [#42](https://github.com/TriplePDigital/nextjs_commercejs/issues/42) from TriplePDigital/dev
* Merge pull request [#1](https://github.com/TriplePDigital/nextjs_commercejs/issues/1) from chef-danny-d/strapi

