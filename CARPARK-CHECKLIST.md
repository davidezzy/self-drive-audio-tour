# Carpark test, Wednesday 21 October 2026

URL: https://davidezzy.github.io/self-drive-audio-tour/
Fallback: https://davidezzy.github.io/self-drive-audio-tour/v0.html (old Orange-only page)

## Before you leave (10 minutes, parked, on wifi)
1. Open the URL in Safari in a normal tab, not the Home Screen. Pull to refresh once so the offline cache loads.
2. Ringer switch on, volume up, phone connected to the car by Bluetooth.
3. Settings, Privacy, Location Services, Safari Websites: While Using the App, Precise Location on.
4. Low Power Mode off. Phone on the charger and mounted.
5. Pick Bathurst. Tap Test voice. Check the Speech line says Speaking and you hear it through the car.
6. Tap Simulate drive. Every Bathurst stop should play in order. If the Speech line shows an error, screenshot it.
7. Reset, then repeat for Orange.
8. Load both towns once while you have signal so they are cached for the drive west of Bathurst.

## Grok navigation test (parked, in the car)
1. Open the app, pick Bathurst, open "Tell the car where to go (Grok)" and read the prompt aloud to Grok. Do not worry about reading it perfectly.
2. Check the car's route list shows all four stops in order. If it drops any, say them again in groups of two ("Add Denison Bridge, then the Royal Hotel, Bathurst NSW").
3. Try the car browser (parked only): open grok.com or x.com/i/grok and see if it offers a text box you can paste the prompt into. This is untested. The car's browser locks while driving.
4. Software needed: 2025.44.25 or later, Grok personality set to Assistant (owner reports, unverified for your car).

## On the road
1. Tap Start drive before you pull out. Allow location when asked.
2. GPS cell should read Live within 30 seconds. "Weak" means wait, "Blocked" means fix location permission.
3. Keep Safari open with the screen on. If the screen locks or you switch apps, GPS and audio will probably stop. This is unverified, so watch for it.
4. Missed a stop or it played late? Tap Play on that row.
5. Heading check is off by default. Turn it on only if stops fire when you drive past them in the wrong direction.

## Known risks
- iPhone web pages cannot run reliably in the background. Locking the screen is the main failure to watch for.
- Wikipedia coordinates can be a block out. Royal Hotel, Miss Traill's House, Old Union Bank and Berrilea have no OpenStreetMap match. Duntryleague differs by 140 m between Wikipedia and OpenStreetMap.
- Bathurst CBD stops are 180 to 190 m apart. Slow traffic is fine. At 50 km/h or faster the Cathedral may be skipped, so tap Play on it.
- Phone voice sounds robotic until MP3s are generated. MP3s fall back to phone voice if missing.
- Dubbo and Mudgee are empty until written.
- Not tested on a real iPhone yet.
