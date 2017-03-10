# BCIC Challenge Datasets Sources

# Shapefile transformation

### Boundary transformation instructions

#### To change the projection:

1. Download boundaries from source. (These come in a zipped folder with shapefile)
2. Open the .prj file that comes in folder downloaded. Look for the projection. (Usually “BC-Environment-Albers” if from BC)
3. Open the .shp file in QGIS.
4. Right click on the layer and click on “Set layer CRS”.
5. Set CRS to the original projection of the layer. (e.g. BC Albers)
6. Right click on layer again and click on “…save as”.
7. Save the layer as a ESRI Shapefile and select “WGS 84/ EPSG 4326” as the projection.

#### To convert .shp file to .geojson (Based on this tutorial: https://medium.com/@mbostock/command-line-cartography-part-1-897aa8f8ca2c#.6eorauhne):

*Install shp2json : ```npm install -g shapefile```
* shp2json command is:
	```shp2json shapefile-name -o new-file-name.json```
	(e.g. “shp2json parks_vancouver.shp -o parks_vancouver.json
”)
* Note: Change into directory with the shapefile first, then move .json file to /src/data/appropriate_file


# Federal Data (NHS)

## Complete_Municipalities.csv (in NHS_Profile_2011)
__Download page:__ https://www12.statcan.gc.ca/nhs-enm/2011/dp-pd/prof/details/download-telecharger/comprehensive/comp-csv-tab-nhs-enm.cfm?Lang=E
* Split into smaller datasets as seen in NHS Profile folder. Here are some brief explanations of each dataset:
        
        * HouseholdCharacteristics: Dwelling and household/occupants characteristics

        * IncomeCosts: Income brackets, 2010 median income(before tax, family, indv), shelter costs (% of income)

        * Commute: Mode of transport and median commute times

        * Mobility: Number of movers (Inter/intra-provincial)

__Data notes:__ Municipalities_Metadata.csv file
* This contains all NHS survey data by Census Subdivisions(municipalities) for BC

* NHS User Guide: Info on sampling design and collection https://www12.statcan.gc.ca/nhs-enm/2011/ref/nhs-enm_guide/guide_2-eng.cfm

* NHS dictionary: https://www12.statcan.gc.ca/nhs-enm/2011/ref/dict/azindex-eng.cfm

## Dwellings_DisArea.csv (Census 2016)
__Download Page:__ http://www12.statcan.gc.ca/census-recensement/2016/dp-pd/hlt-fst/pd-pl/comprehensive.cfm
* Download Dissemination Areas csv

__Data Notes:__ http://www12.statcan.gc.ca/census-recensement/2016/dp-pd/hlt-fst/pd-pl/About.cfm


# Provincial data

## Population Projections (Aug 2016)

### Population_Projection_Formatted_RegionalDistricts.csv
__Download page:__ http://www.bcstats.gov.bc.ca/StatisticsBySubject/Demography/PopulationProjections.aspx

__Data Notes:__ Click on "BC Level Population Projection Technical Assumptions" link on download page.

## Education

### school_locations.csv
__Download page:__ https://catalogue.data.gov.bc.ca/dataset/bc-schools-school-locations
* Download the .txt file

__Data Notes:__ http://www.bced.gov.bc.ca/reporting/odefiles/SchoolLocationsNotes.pdf


_Data-transformation_
Removed due to null lat or lon:

```
2013/2014,BC Public School,47,Powell River,4747000,SD 47 Continuing Education,Continuing Ed,Null,POWELL RIVER,BC,Null,Null,Null,Null,Null,SECONDARY,12-Oct,FALSE,TRUE
2013/2014,BC Public School,53,Okanagan Similkameen,5399290,Southern Okanagan Alt,Alternate,"10332-35TH AVE, OLIVER, BC",OLIVER,BC,V0H1T0,250 498-4931,250 498-6957,Null,Null,JUNIOR SECONDARY,10-Aug,FALSE,TRUE
```

### postsecondary_locations.csv
__Download page:__ https://catalogue.data.gov.bc.ca/dataset/81558d54-1f96-46c2-94fe-56d26f69c4f5

__Data notes:__ Can be found at the bottom of the `postsecondary_locations.csv` file. Contact info on download page.

## Health Services

### hospital_locations.csv
__Download page and notes:__ https://catalogue.data.gov.bc.ca/dataset/bc-health-care-facilities-hospital

### hlbc_WalkInClinics.csv
__Download page and notes:__ 
https://catalogue.data.gov.bc.ca/dataset/walk-in-clinics-in-bc


### hlbc_EmergencyRooms.csv
__Download page and notes:__ 
https://catalogue.data.gov.bc.ca/dataset/emergency-rooms-in-bc
*Unused columns removed (STREET_NUMBER, STREET_TYPE, STREET_DIRECTION)

## Property Transfer Tax Data (PTT)

### ptt_monthly, ptt_weekly
Municipality monthly and Regional District Weekly
__Download page:__ 
https://catalogue.data.gov.bc.ca/dataset/property-transfer-tax-data

*Note monthly data was collected on the 1st, 8th, 15th and 22nd of each month.

# Municipal Data

## Bike Routes

### bike_routes_kelowna
From Active_Transportation.shp on Active Transportation City of Kelowna

__Download page:__ http://opendata.kelowna.ca/datasets/active-transportation?selectedAttribute=FacilityType

http://apps.kelowna.ca/opendata/od001.cfm (also available for download here)

### bike_routes_vancouver
From bikeways.shp on Bikeways data Vancouver

__Download page:__ 
http://data.vancouver.ca/datacatalogue/bikeways.htm

### bike_routes_victoria.json
From BikeRoutes_Victoria.shp under 'Bike Routes'

__Download page:__ 
http://www.victoria.ca/EN/main/online-services/open-data-catalogue.html

## Parks

### parks_kelowna
__Download page:__ 
http://opendata.kelowna.ca/datasets/park

http://apps.kelowna.ca/opendata/od001.cfm (also available for download here)
*Includes dog status

### parks_vancouver
Parks data under 'Parks (polygon features)' .shp
__Download page:__ 
http://data.vancouver.ca/datacatalogue/parks.htm
*Note probably does not include dog status

### parks_victoria
From "Parks (Location, amenities, dogs off leash)" .shp
__Download page:__ 
http://www.victoria.ca/EN/main/online-services/open-data-catalogue.html

## Transit

### TransitCosts_Municipalities.csv (Custom built)

__Sources__: BC Transit and Translink fares and route maps

BC Transit (Victoria fares): https://bctransit.com/victoria/fares
Replace “victoria” in the url with other “Coverage Area” names in the dataset, to access appropriate fares pages.

Translink: http://www.translink.ca/en/Fares-and-Passes/Single-Fares.aspx (Single fares)
http://www.translink.ca/en/Fares-and-Passes/Monthly-Pass.aspx (Monthly pass)

Number of people taking public transit to go to work: https://www12.statcan.gc.ca/nhs-enm/2011/dp-pd/prof/details/download-telecharger/comprehensive/comp-csv-tab-nhs-enm.cfm?Lang=E (Same source as NHS data)

__Data-transformation__: Only municipalities with > 0 number of people who take public transit have been included. Some rural areas have also been removed even if several people take transit. Currently only regular Adult single fare and monthly fares are included.

### transit_stops.csv (Custom built)

__Source__: Google maps for coordinates of each stop.

__Data notes:__ This currently only covers TransLink's Expo, Millenium, and Canada lines.