motorway
========
v0.3
- map fixed
- add more kml files
- remove unused js
- edit some css
- edit index.php for some texts
- add geolocation feature (click on the motorway logo on the top left)


v0.4 
- Pavement Damage Added
- edit index.php for some layout
- edit style.css
- edit controller.js, view.js, script.js

v0.5
- Edit save photo button (in video.js)

branch(2)
v.0.6

- Create getImageDirectory() function in script.js (for example, image of 070200M00 is in the same directory with 070101M00 and for the same with 070401M00 is in 070301M00, 090402M00->090401M00, 090600M00->090500M00)
- Edit ignore_section.php, controller.js, index.php, script.js for new algorithm (search for the whole main way)
- Edit ignore_section.php to inform the user the maximum km. range if users' input exceed the maximum km of that section
- Add new data for pavement (csv file)
- Edit gis.js at addPoints function (change all result mindis to g_all_result[mindis])
- Some bug fixed in controller.js script.js
