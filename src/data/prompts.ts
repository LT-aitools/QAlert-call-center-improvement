/**
 * Prompts for each request type, keyed by exact request type name.
 * Source: Database/PromptsforRequestTypes.xls
 */
export const REQUEST_TYPE_PROMPTS: Record<string, string> = {
  'A Job Well Done!': 'Information we need:\n• Name of the employee\n• Description of event.',

  'Boat Speeding': 'Information we need:\n• Describe the boat; if possible provide the vessel number.\n• Provide a location or marker # of where the incident is occurring.',

  'Code Compliance/Code Issues': '* Contact info and email for all Code Compliance prompts.\nAdministrative Assistant\ncodeCompliance@cityofpsl.com\n(772) 871 – 5010',

  'Commercial Vehicle': '*DISCLAIMER* – Due to Legislative changes, Code Compliance can no longer receive anonymous complaints. Staff will need your name and your address along with the complaint information to investigate.\n\nCommercial Vehicles (box trucks, semi-trucks) cannot be in residential areas unless they are at an active work site. Code Compliance will investigate to make sure it falls under the classification of a commercial vehicle.',

  'Illegal Sign': '*DISCLAIMER* – Due to Legislative changes, Code Compliance can no longer receive anonymous complaints. Staff will need your name and your address along with the complaint information to investigate.\n\nNo signs shall be placed in the City rights-of-way. Please refer to the sign code for proper placement of signs.\n\nSign Code: https://www.cityofpsl.com/government/departments/neighborhood-services/code-compliance/sign-code\n\nCode Compliance will investigate to make sure it falls under the classification of an illegal sign.',

  'Construction Debris': 'Information we need:\n• What is the address of the site? If you do not have an address, please provide as much information on location as you have, such as cross streets, or neighboring addresses.\n• Do you know who the contractor is?',

  'High Grass & Weeds': '*DISCLAIMER* – Due to Legislative changes, Code Compliance can no longer receive anonymous complaints. Staff will need your name and your address along with the complaint information to investigate.\n\nGrass and/or Weeds 12 inches or higher is a violation of code. Code Compliance will open a case and complete an inspection to confirm the violation.',

  'Open Storage': '*DISCLAIMER* – Due to Legislative changes, Code Compliance can no longer receive anonymous complaints. Staff will need your name and your address along with the complaint information to investigate.\n\nThis includes any and all items that should not be openly stored outside. This requirement does not apply to patio furniture, grills and other household items specifically designed for outdoor use. This will need to be investigated by Code Compliance to make sure it falls under the classification of open storage.',

  'Park': 'Please provide:\n• Is the material offensive? If yes, please contact 911 for immediate assistance.\n• If inoffensive, please provide location or name of park and location of the graffiti/vandalism.\n• Details of the issue.',

  'Private Property': 'Information we need:\n• Is the material offensive? If yes, please contact 911 for immediate assistance.\n\nInformation you need:\n• Graffiti on public properties can be removed/cleaned immediately by Code Compliance.\n• Cases will be open for graffiti on private property.',

  'Recreational Facility': 'Information we need:\n• Where in the facility is the issue located?',

  'Botanical Gardens': 'Please provide:\n• Is the material offensive? If yes, please contact 911 for immediate assistance.\n• If inoffensive, please provide location of the graffiti/vandalism.\n• Details of the issue.',

  'Mid Florida Event Center': 'Please provide:\n• Is the material offensive? If yes, please contact 911 for immediate assistance.\n• If inoffensive, please provide location of the graffiti/vandalism.\n• Details of the issue.',

  'Community Center': 'Please provide:\n• Is the material offensive? If yes, please contact 911 for immediate assistance.\n• If inoffensive, please provide location of the graffiti/vandalism.\n• Details of the issue.',

  'Minsky Gym': 'Please provide:\n• Is the material offensive? If yes, please contact 911 for immediate assistance.\n• If inoffensive, please provide location of the graffiti/vandalism.\n• Details of the issue.',

  'Saints Golf Course': 'Please provide:\n• Is the material offensive? If yes, please contact 911 for immediate assistance.\n• If inoffensive, please provide location of the graffiti/vandalism.\n• Details of the issue.',

  'Right of Way Mowing': 'Information we need:\n• Location (intersection, highway, etc.)\n• Is this a line of sight issue?\n• Is this a beautification or maintenance issue?',

  'Road Median Landscaping': 'Information we need:\n• Location (intersection, highway, etc.)\n• Is this a line of sight issue?\n• Is this a beautification or maintenance issue?',

  'Sewer Issues': 'If this is a water or sewer request for service or emergency, such as a water line break, sewer alarm or back up, please call 772 873-6400, to reach our Utility staffed 24/7 phone center, so we can immediately dispatch appropriate personnel to address the issue.',

  'Sidewalk Issue': 'Sidewalks Master Plan: www.cityofpsl.com/sidewalks',

  'Sidewalk Request': 'Information we need:\n• Location (intersection, road, address, etc.)\n\nSidewalks Master Plan: www.cityofpsl.com/sidewalks',

  'Sidewalk Repair': 'Information we need:\n• Location (intersection, road, address, etc.)\n\nSidewalks Master Plan: www.cityofpsl.com/sidewalks',

  'Repaving': 'Information we need:\n• Location (intersection, road, address, etc.)',

  'Pothole': 'Information we need:\n• Location (intersection, road, which side of road, etc.)\n• Size of the pothole.',

  'Traffic Operations': 'Information we need:\n• Does this concern a traffic light or traffic sign?\n• If this concerns a traffic light that is out or a downed stop sign, call 911.',

  'Unlicensed Contracting': 'Please provide:\n• What type of work are they performing?\n• Are they currently on site working?\n• Address or location details\n• Business name / details from vehicle on site.',

  'Unpermitted Work': 'Please provide:\n• What is the address where the work is/was performed?\n• What type of work is being performed?\n• Are they currently on site working?',

  'Drinking Water Issues': 'If this is a water or sewer request for service or emergency, such as a water line break, sewer alarm or back up, please call 772 873-6400, to reach our Utility staffed 24/7 phone center, so we can immediately dispatch appropriate personnel to address the issue.',

  'Buildings Issue': 'Please provide:\n• Location of building\n• Name or type of building\n• Details of the issue.',

  'Fields and Grounds Issue': 'Please provide:\n• Type and location of the specific field\n• Details of the issue.',

  'Playground Issue': 'Please provide:\n• Location or name of park\n• Location of the equipment\n• Details of the issue (broken, dirty, hazardous)\n• Is this a fencing issue?',

  'Tennis/Basketball Courts Issue': 'Please provide:\n• Location or name of park\n• Location of court in the park\n• Details of issue\n• Is this a lighting issue?',

  'Light Out (City Facility Only)': 'Please provide:\n• Location of the light and name of the park\n• Is the light on a building or on a pole?\n• Is the light on an athletic field? (score board/field light)',

  'Swale Rework': 'Please allow seven days without rainfall for the water to recede before submitting a request for service. The swales are designed to collect stormwater and deliver runoff to canals and waterways prior to discharge to the river.\n\nIf water is covering the road after 24 hours after a rain event or your swale is blocked, please provide:\n• Location (intersection, road, address, etc.)',

  'Loud Music/Noise': 'Information we need:\n• Tell us about the noise time frame.\n• Is the noise music, yelling, talking, animals, etc?\n• Fireworks concerns — immediately call 911 to dispatch an officer.',

  'Vehicle Speeding/Aggressive Driver': 'Information we need:\n• Time frame of the speeding.\n• Make and model of the vehicle; if possible, license plate number.\n\nTraffic calming requests should be added to Traffic Operations.',

  'Pavement Repair': 'Information we need:\n• Location (intersection, road, address, etc.)',

  'Inoperative Vehicle': '*DISCLAIMER* – Due to Legislative changes, Code Compliance can no longer receive anonymous complaints. Staff will need your name and your address along with the complaint information to investigate.\n\nCode Compliance will investigate to ensure it falls under the classification of an inoperative vehicle. No inoperative vehicle shall be parked, kept or stored on any premises, unless in an enclosed structure, and no vehicle shall at any time be in a state of disassembly, disrepair, or in the process of being stripped or dismantled.\n\nExamples: Flat tires, no license plate, a car on jack stands.',

  'Improper Parking': '*DISCLAIMER* – Due to Legislative changes, Code Compliance can no longer receive anonymous complaints. Staff will need your name and your address along with the complaint information to investigate.\n\nDescribe make, model and color of the vehicle. Provide tag if possible.\n\nCommon Improper Parking Complaints:\n• Front Yard Parking\n• Parking on the road and/or parking too close to the roadway\n• Parking against the flow of traffic\n• Vertically parking vehicle in the swale\n• Parking on swale without owner\'s consent.',

  'Vacant Lot Encroachment (Private Property) ': 'Vacant lot encroachment complaints are not allowed to be anonymous per the Ordinance being complaint-driven. Once a complaint is entered into the system, it will be a public record.\n\nInformation we need:\n• Is the vacant lot to the right, left or behind your property?\n\nInformation you need:\n• The Vacant Lot Specialist will investigate to verify if the lot is in violation per City Code.\n• If a complaint has been entered in the past 12 months, the complaint will be closed.',

  'Illegal Dumping': '*DISCLAIMER* – Due to Legislative changes, Code Compliance can no longer receive anonymous complaints. Staff will need your name and your address along with the complaint information to investigate.\n\n• Does the resident know who dumped the materials? If so, please provide this information.\n• Location of the items.\n• Description of the items (sofa, mattress, construction material).',

  'Unsecured/Unmaintained Pool': '*DISCLAIMER* – Due to Legislative changes, Code Compliance can no longer receive anonymous complaints. Staff will need your name and your address along with the complaint information to investigate.\n\nThis is a life safety issue. Pools must be completely surrounded by a permitted fence or a barrier. Pool water that is green or off-colored is considered unmaintained and a violation of city codes.',

  'Shutters Closed/Secured': '*DISCLAIMER* – Due to Legislative changes, Code Compliance can no longer receive anonymous complaints. Staff will need your name and your address along with the complaint information to investigate.\n\nStorm shutters should not be in the closed and/or secured position unless a hurricane or tropical storm watch occurs. Shutters can be closed from June 1st to November 30th if there are no persons in the dwelling. Code Compliance will open a case and complete an inspection to confirm the violation.',

  'Multi-Family Living': '*DISCLAIMER* – Due to Legislative changes, Code Compliance can no longer receive anonymous complaints. Staff will need your name and your address along with the complaint information to investigate.\n\nInformation you need:\n• More than 2 unrelated people living in household.\n• This will be monitored by Code Compliance to establish a solid case.',

  'Community Residential Home (Licensed Facility)': '*DISCLAIMER* – Due to Legislative changes, Code Compliance can no longer receive anonymous complaints. Staff will need your name and your address along with the complaint information to investigate.\n\nQuestions, Reservations, Licensing – please email crh@cityofpsl.com or call (772) 871–5010. Does not include sober homes.',

  'Garage Sale': 'No permit or fees required.\n\nThere is an application that can be filled out for advertisement purposes on our City\'s website:\nhttps://forms.cityofpsl.com/NS/code/GarageSales/GarageSale\n\nNo signs are allowed in the City rights-of-way:\nhttps://www.cityofpsl.com/government/departments/neighborhood-services/code-compliance/sign-code',

  'Other Code Issue': '*DISCLAIMER* – Due to Legislative changes, Code Compliance can no longer receive anonymous complaints. Staff will need your name and your address along with the complaint information to investigate.\n\nInformation we need:\n• Please state the concern you would like Code Compliance to investigate.',

  'Solid Waste (Garbage/Recycling/Yard Waste)': 'This will be shared with City Staff and the FCC Liaison to address accordingly.',

  'Yard Waste': 'Information we need:\n\nInformation you need:\nClam Trucks will be scheduled to pick up large yard waste piles the day after your normal yard waste day.',

  'Garbage/Trash': 'What is your normal service day?\n\nComplaint Examples: Missed pick-up, missed street, days missed.\n\nCheck the map for your designated collection days:\nhttps://pslgis.maps.arcgis.com/apps/webappviewer/index.html?id=d837c1c81e3640c585be748ae7a1ebf6',

  'Recycling': 'What is your normal service day?\n\nComplaint Examples: Missed pick-up, missed street, days missed.\n\nCheck the map for your designated collection days:\nhttps://pslgis.maps.arcgis.com/apps/webappviewer/index.html?id=d837c1c81e3640c585be748ae7a1ebf6',

  'Bulk Trash - furniture, appliances, etc.': 'What needs to be recovered? Furniture, Appliances, etc.\n\n*Bulk Waste cannot exceed the 2 cu. yd limit – an additional service will need to be scheduled with FCC.*\n\nCheck the map for your designated collection days:\nhttps://pslgis.maps.arcgis.com/apps/webappviewer/index.html?id=d837c1c81e3640c585be748ae7a1ebf6',

  'Garbage Cart Replacement (RFS)': 'FCC will investigate this request and make contact with the resident. If a cart was damaged by FCC, they will replace it.',

  'Community Programs / Neighborhood Services ': '* Contact info and email for all NICE programs.\nCommunity Programs Administrator\nNICE@cityofpsl.com\n(772) 871-7395',

  'City University': 'Information we need:\n\nInformation you need:\nPlease refer to the expert (Community Programs Administrator).',

  'Community Engagement Suggestions': 'Information we need:\n\nInformation you need:\nExamples: Neighborhood Block Parties, Clean-ups etc.',

  'Litter/Trash Can': 'Please provide:\n• Location of park or building\n• Location of the trash can\n• Is this for an overflowing trash can?\n• Is the trash can missing?',

  'Ask Us': 'Not finding a request type that fits your request? Please submit details of your inquiry here and the appropriate member of staff will reach out to you directly.',

  'Public Records Request': '',

  'Lien Inquiry': 'Information we need:\n• Property address for the inquiry.',

  'Exterior (Structure)': '*DISCLAIMER* – Due to Legislative changes, Code Compliance can no longer receive anonymous complaints. Staff will need your name and your address along with the complaint information to investigate.\n\nInformation you need:\nThis includes multiple different violations, but the most common would include: Mildew on the exterior of the home, missing or damaged soffits, wood rot, damaged fascia.',

  'Litter on public property ': 'This request will go to our Keep Port St. Lucie Litter Crew to address. Location examples would be medians & sidewalks.',

  'Dumping Hazardous Waste (Land-base only)': 'Please provide:\n• Location (intersection, road, address, etc.)\n• Description of waste\n\nIf there is dumping hazardous waste within a waterway, please use the "Illegal Discharge to Waterway/Canal/Swale" request type.',

  'Dumping Yard Waste in Canal/Waterway': 'Please provide:\n• Location (intersection, road, address, etc.)\n• Description of waste.',

  'Traffic Calming Request': 'Traffic Calming Requests can only be submitted via request from and petition.\nhttps://www.cityofpsl.com/government/departments/public-works/traffic-calming-policy',

  'Illegal Discharge to Waterway/Canal/Swale': 'Please provide:\n• Location (nearest intersection, road, address, etc.)\n• Description of waste\n\nIf there is dumping hazardous waste that is land-based, please use the "Dumping Hazardous Waste (Land-base only)" request type.',

  'Endangered Protected Species': 'This service is not provided by the City of Port St. Lucie. To report this immediately contact the Wildlife Alert Hotline at 888-404-3922, or report it online at https://myfwc.com/contact/wildlife-alert/, or via email to Tip@MyFWC.com.',

  'Contractor Issues': 'Please provide:\n• What is the address where the work was performed?\n• Who is the Contractor?\n• What type of work was performed?\n• Details of the issue.',

  'Emergency Issues': 'Please call 911. It is the most efficient way to have an officer respond to your location immediately.',

  'Animal Abuse Concerns/Injured Wildlife': 'Information we need:\n• Call 911 for immediate assistance.\n\nFor the Animal Control Office, please call 772-871-5042.',

  'Dead Animal (Wildlife Roadside/ FCC)': 'FCC only collects wildlife when it is placed curbside. They are unable to collect from private property. This request will be routed directly to FCC for collection.\n\nIf this is a dog or cat, please call Animal Control directly at 772 871-5042 or 911 for immediate assistance.',

  'Nuisance Animals': 'Information you need:\nExcessive barking or animal at large — immediately call 911.',

  'Construction Noise': 'Information we need:\n• Location (intersection, road, address, etc.)',

  'Construction Dust': 'Information we need:\n• Location (intersection, road, address, etc.)',

  'Construction Blocking Road': 'Information we need:\n• Location (intersection, road, address, etc.)',

  'Construction Blocking Sidewalk': 'Information we need:\n• Location (intersection, road, address, etc.)',

  'Commercial Stormwater Discharges': 'Information we need:\n• Location (intersection, road, address, etc.)',

  'Graffiti on Traffic Facility': 'Information we need:\n• Location (intersection, road, address, etc.)',

  'Pavement Marking/Striping': 'Information we need:\n• Location (intersection, road, address, etc.)',

  'Road Sign': 'If this is about a stop sign that is not visible or down, please call 911.\n\nInformation we need:\n• Location (intersection, street, etc.)',

  'School Zone/Crosswalk Flasher': 'Information we need:\n• Location (intersection, road, address, etc.)',

  'Street Light Repair': 'Information we need:\n• Location (intersection, road, address, etc.)',

  'Traffic Control Box': 'Information we need:\n• Location (intersection, road, address, etc.)',

  'Traffic Signal': 'If this is about a traffic signal that is out or is in flash mode please call 911.\n\nInformation we need:\n• Location (intersection, street, etc.)',

  'Guardrail': 'Information we need:\n• Location (intersection, road, address, etc.)',

  'Stormwater Pipe Broken': 'Please provide:\n• Location (intersection, road, address, etc.)',

  'Fish Kill': 'Please provide:\n• Location (nearest intersection, road, address, etc.)\n• Degree of severity (how many fish)\n• State of water (cloudy, discolored)',

  'Silt Fence Issues': 'Information we need:\n• Location (intersection, road, address, etc.)',

  'Plant/Tree Maintenance': 'Location (intersection, road, address, etc.)\n\nEnvironmental Services Division (Public Works)\nMore information: https://www.cityofpsl.com/government/departments/public-works/drainage-roadway-mowing-landscape-maintenance',

  'Property Damaged by Crews': 'Information we need:\n• Location (intersection, road, address, etc.)',

  'Sprinkler/Irrigation Issues': 'Information we need:\n• Location (intersection, road, address, etc.)',

  'Algae/Plants in Water': 'Information we need:\n• Location (intersection, road, address, etc.)',

  'Overgrown Vacant Lot (City Property)': 'Information we need:\n• Location (intersection, road, address, etc.)',

  'Street Sweeper Needed': 'Information we need:\n• Location (intersection, road, address, etc.)',

  'Debris in Roadway': 'Information we need:\n• Location (intersection, road, address, etc.)',

  'Road / Sidewalk / Bridge / Bus Shelter ': 'Information we need:\n• Location (intersection, road, address, etc.)',

  'Swale Liner Repair': 'Information we need:\n• Location (intersection, road, address, etc.)',

  'Swale Liner Cleaning': 'Information we need:\n• Location (intersection, road, address, etc.)',

  'Crews Left Debris on Property': 'Information we need:\n• Location (intersection, road, address, etc.)',

  'City Road Project': 'Information we need:\n• Location (intersection, road, etc.)\n• Is this a question about a future project or one that is under construction now?',

  'City Sidewalk Project': 'Please visit the Sidewalk Master Plan webpage at https://www.cityofpsl.com/government/departments/public-works/projects/sidewalk-master-plan for full project details.\n\nFor additional project information, please provide:\n• Location (intersection, road, etc.)\n• If this is about a current or future sidewalk project.',

  'City Drainage Project': 'To look up the current and future project list, please visit www.cityofpsl.com/government/projects-improvements.\n\nFor additional project information, please provide:\n• Location (intersection, road, etc.)',

  'Canal/Waterway Overgrown': 'Please provide:\n• Location (intersection, road, address, etc.)',

  'Washout or Erosion': 'Please provide:\n• Location (intersection, road, address, etc.)',

  'Curb/Gutter/Headwall Repair': 'Please provide:\n• Location (intersection, road, address, etc.)',

  'Storm Drain Grate Blocked': 'Please provide:\n• Location (intersection, road, address, etc.)\n• Describe concern (e.g., excessive debris blocking the grate).',

  'Water Level in Canal': 'Please provide:\n• Location (intersection, road, address, etc.)\n• Please clarify if water level is higher or lower than expected.',

  'Light Pole/Signal Pole or Traffic Control Box': 'Information we need:\n• Location (intersection, road, address, etc.)\n• Light Pole number if available.',

  'Fitness Equipment': 'Please provide:\n• Location of equipment\n• Details of the issue (broken, dirty, hazardous).',

  'EOC Drainage/Streets': 'Potholes, trees down in the canal, bridge checking, drain clearing, canal pump house, fuel and stage trucks, prep materials/equipment/tools, prep and secure the compound.',

  'EOC Push to Swale': 'Things in the road (trees, damaged property debris, dead animals etc.) — Not powerlines.',

  'EOC Traffic Control': 'Stop sign down, traffic signal out, overhead signs damaged, preventative signal removal & replacement.',

  'Request a Residential Street Light': 'Residents can complete the online form on our website at www.cityofpsl.com/streetlights or one can be provided to you in a variety of ways by contacting the Clerk\'s Office at (772) 871-5157.\n\nTo report a street light out or malfunctioning, go to FPL\'s Lighting Trouble Report Web page.',

  'Make a General Customer Service Inquiry': 'Not finding a request type that fits your request? Please submit details of your inquiry here and the appropriate member of staff will reach out to you directly.',

  'New Liner Installation': 'Please provide:\n• Location (intersection, road, address, etc.)\n\nIf your concern is related to existing swale liner, please use the "Swale Liner Repair/Replacement" request type.',

  'Tracking Dirt on Road': 'Information we need:\n• Location (intersection, road, address, etc.)',

  'Right of Way and Easement Inquiry': '',

  'Construction Inspection Question/Issue': 'Please provide:\n• Property address\n• Permit number\n• Inspection Type\n• Details of issue.',

  ' Blocked Swale – New Construction': 'Please provide:\n• Location (intersection, road, address, etc.)',

  'Blocked Swale – New Construction': 'Please provide:\n• Location (intersection, road, address, etc.)',

  'Drainage Inquiry / Education': 'Please allow seven days without rainfall for the water to recede before submitting a request for service. The swales are designed to collect stormwater and deliver runoff to canals and waterways prior to discharge to the river.\n\nIf water is covering the road after 24 hours after a rain event or your swale is blocked, please provide:\n• Location (intersection, road, address, etc.)',

  'Floresta Drive': 'Please visit the Floresta Drive Improvement Project webpage for full project details.\n\nFor additional project information, please provide:\n• Location (intersection, road, etc.)',

  'Turbid Stormwater Discharges': 'Please visit the Illicit Discharges webpage for full details on what is and is not allowed in the stormwater system.\n\nIf you are noticing any potential turbid stormwater discharge, please provide:\n• Location (address of site).',

  'PSL Blvd South': 'Please visit the PSL Blvd South webpage at https://www.cityofpsl.com/pslblvdsouth for full project details.\n\nFor additional project information, please provide:\n• Location (intersection, road, etc.)',

  'Billing Question': 'If this is a water or sewer request for service or emergency, such as a water line break, sewer alarm or back up, please call 772 873-6400, to reach our Utility staffed 24/7 phone center, so we can immediately dispatch appropriate personnel to address the issue.',

  'Recycling Cart (RFS) - New Request ': 'Please check the box for the cart size desired. This will be shared with City Staff and the FCC Liaison to address accordingly.',

  'Estimate Request (RFS) - Bulk/Yard Waste ': 'What needs to be recovered?\n\nAn FCC representative will call you to confirm additional bulk trash collection scheduling and costs associated.',

  'Garbage Cart (RFS) - Swap ': 'Please check the box for the cart size desired. A representative will call you to confirm cart swap request and scheduling.',

  'Garbage Cart (RFS) - New Request': 'Please check the box for the cart size desired. This will be shared with City Staff and the FCC Liaison to address accordingly.',

  'Garbage Cart (RFS) - Additional Cart': 'Please check the box for the cart size desired. An FCC representative will call you to confirm additional cart request, scheduling and costs associated.',

  'Recycling Cart (RFS) - Additional Cart': 'Please check the box for the cart size desired. An FCC representative will call you to confirm additional cart request, scheduling and costs associated.',

  'Spill/leak': 'Glass spills, oil leaks by FCC truck.',

  'FCC Driver Complaint': 'FCC will investigate this complaint and make contact with the resident.',

  'Recycling Cart Replacement (RFS)': '',

  'General Records Request': '',

  'Request for Survey or Permit Records (Building Dept.)': 'The City has a Public Records Request Portal to submit requests for documents. By utilizing this system the custodian of records can communicate with you and send documents through the system. You will also be able to check the status of the request.\n\nMust provide address, documents requested and email address. The public records portal can be accessed here: cityofpsl.com/services',

  'General Permit Questions': 'Please provide information on what type of work will be conducted. Provide as much detail as possible so staff can respond appropriately.\n\nApplications and checklist for requirements of permits are available on the website at cityofpsl.com/government/departments/building',

  'Low Speed Vehicles/Golf Carts ': '',

  'Damaged Property ': 'FCC will investigate this complaint and make contact with the resident. If a cart was damaged by FCC, they will replace it.',

  'Litter': '',

  'Commercial Litter': '',

  'SW California Blvd Widening ': 'Please visit the St. Lucie West Blvd Projects webpage at www.cityofpsl.com/projecttracker for full project details.\n\nFor additional project information, please provide:\n• Location (intersection, road, etc.)',

  'Torino Parkway Intersection Improvements ': 'Please follow the link for more information on North Torino Parkway & East Torino Parkway Intersection Improvements: www.cityofpsl.com/projecttracker\n\nFor additional project information, please provide:\n• Location (intersection, road, etc.)',

  'Tulip and College Park Improvements ': 'Please follow the link for more information on Tulip Boulevard / College Park Road Intersection Improvements: www.cityofpsl.com/projecttracker\n\nFor additional project information, please provide:\n• Location (intersection, road, etc.)',

  'St. Lucie West Blvd. Widening ': 'Please visit the St. Lucie West Blvd Projects webpage at www.cityofpsl.com/projecttracker for full project details.\n\nFor additional project information, please provide:\n• Location (intersection, road, etc.)',

  'Other City Project': 'Please visit the City Project Tracker webpage at www.cityofpsl.com/projecttracker for full project details.\n\nFor additional project information, please provide:\n• Location (intersection, road, etc.)\n• If this is about a current or future project.',

  'General': 'All requests from City Council or the City Manager to be addressed by Public Works Management.',

  'Safety Concern': 'Concerns with a hazard on City Property (e.g., Bees or spills in the road). For debris in the road please utilize the request type under Street Issue.',

  'EOC Internal Request': '',

  'TEST': 'This is a test request type.',

  'Incidents': 'Examples for use: Hydraulic Spills, destroyed mailboxes and downed power lines.',

  'Parks & Rec Administration': 'For City Council / City Manager request only.',

  'Special Events Request': 'For all P&R requests from within the organization:\n• Internal event set up / stage use\n• Questions for P&R Event Staff.',

  'Dead Animal (Domestic)': 'Call 911 for immediate assistance.',
};
