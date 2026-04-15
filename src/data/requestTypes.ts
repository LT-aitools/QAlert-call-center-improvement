export interface RTNode {
  name: string;
  dept: string;
  children: RTNode[];
}

function leaf(name: string, dept: string): RTNode {
  return { name, dept, children: [] };
}

function node(name: string, dept: string, children: RTNode[]): RTNode {
  return { name, dept, children };
}

export const REQUEST_TYPES: RTNode[] = [
  leaf('A Job Well Done!', 'Human Resources'),

  node('Animal Issues', 'Animal Control', [
    leaf('Nuisance Animals', 'Animal Control'),
    leaf('Animal Abuse Concerns/Injured Wildlife', 'Animal Control'),
    leaf('Dead Animal (Domestic)', 'Animal Control'),
    leaf('Dead Animal (Wildlife Roadside/FCC)', 'Animal Control'),
  ]),

  leaf('Ask Us', "City Manager's Office"),

  leaf('Building Department Administration', 'Building'),

  node('Business Inquiry', 'Finance', [
    leaf('Business Tax Investigation', 'Finance'),
    leaf('Unlicensed Business', 'Finance'),
  ]),

  node('Business Navigator', "City Manager's Office", [
    leaf('Project Status Inquiry', "City Manager's Office"),
    leaf('Clarification Assistance', "City Manager's Office"),
    leaf('Process Expedition', "City Manager's Office"),
  ]),

  leaf('City Council Administrative Request', 'City Council'),

  node('City Manager Administrative Request', "City Manager's Office", [
    leaf('City Manager Staff Assignment', "City Manager's Office"),
    leaf('3rd Party Utility Companies', "City Manager's Office"),
    leaf('Assigned to Department', "City Manager's Office"),
    leaf('City Owned Property Request', "City Manager's Office"),
    leaf('City Council Action Item', "City Manager's Office"),
  ]),

  node('City Projects', 'Public Works', [
    leaf('Guardrail', 'Public Works'),
    node('City Road Project', 'Public Works', [
      leaf('Crosstown Western Extension Project', 'Public Works'),
      leaf('PSL Blvd South', 'Public Works'),
      leaf('SW California Blvd Widening', 'Public Works'),
      leaf('Torino Parkway Intersection Improvements', 'Public Works'),
      leaf('Tulip and College Park Improvements', 'Public Works'),
      leaf('St. Lucie West Blvd. Widening', 'Public Works'),
      leaf('Floresta Drive', 'Public Works'),
    ]),
    leaf('City Sidewalk Project', 'Public Works'),
    leaf('City Drainage Project', 'Public Works'),
    leaf('Other City Project', 'Public Works'),
  ]),

  node('Code Compliance/Code Issues', 'Neighborhood Services', [
    leaf('PW Verified Failed Culvert', 'Neighborhood Services'),
    leaf('Commercial Vehicle', 'Neighborhood Services'),
    leaf('Illegal Sign', 'Neighborhood Services'),
    node('Property Maintenance', 'Neighborhood Services', [
      leaf('Exterior (Structure)', 'Neighborhood Services'),
      leaf('High Grass & Weeds', 'Neighborhood Services'),
      leaf('Open Storage', 'Neighborhood Services'),
      leaf('Unsecured/Unmaintained Pool', 'Neighborhood Services'),
      leaf('Shutters Closed/Secured', 'Neighborhood Services'),
    ]),
    leaf('Inoperative Vehicle', 'Neighborhood Services'),
    leaf('Improper Parking', 'Neighborhood Services'),
    leaf('Vacant Lot Encroachment (Private Property)', 'Neighborhood Services'),
    leaf('Multi-Family Living', 'Neighborhood Services'),
    leaf('Community Residential Home (Licensed Facility)', 'Neighborhood Services'),
    leaf('Garage Sale', 'Neighborhood Services'),
    leaf('Other Code Issue', 'Neighborhood Services'),
    leaf('PW Verified Swale Liner Damage', 'Neighborhood Services'),
    leaf('NSD Administration', 'Neighborhood Services'),
    leaf('Site Plan Violations', 'Neighborhood Services'),
  ]),

  node('Commercial Construction Issues', 'Public Works', [
    leaf('Tracking Dirt on Road', 'Public Works'),
    leaf('Construction Dust', 'Public Works'),
    leaf('Construction Noise', 'Public Works'),
    leaf('Silt Fence Issues', 'Public Works'),
    leaf('Right of Way and Easement Inquiry', 'Public Works'),
  ]),

  node('Community Programs / Neighborhood Services', 'Neighborhood Services', [
    leaf('N.I.C.E', 'Neighborhood Services'),
    leaf('City University', 'Neighborhood Services'),
    leaf('Community Engagement Suggestions', 'Neighborhood Services'),
    leaf('Social Services Inquiries', 'Neighborhood Services'),
    leaf('Housing Inquiries', 'Neighborhood Services'),
    leaf('Homelessness', 'Neighborhood Services'),
    leaf('Grant Program Inquiries', 'Neighborhood Services'),
  ]),

  node('Drainage Issue', 'Public Works', [
    leaf('Stormwater Pipe Broken', 'Public Works'),
    leaf('Swale Liner Repair', 'Public Works'),
    leaf('Canal/Waterway Overgrown', 'Public Works'),
    leaf('Washout or Erosion', 'Public Works'),
    leaf('Curb/Gutter/Headwall Repair', 'Public Works'),
    leaf('Storm Drain Grate Blocked', 'Public Works'),
    leaf('Water Level in Canal', 'Public Works'),
    leaf('Swale Rework', 'Public Works'),
    leaf('Reassign to Design', 'Public Works'),
    leaf('Canal/Waterway Washout or Erosion', 'Public Works'),
    leaf('Blocked Swale – New Construction', 'Public Works'),
    leaf('Drainage Inquiry / Education', 'Public Works'),
    leaf('New Liner Installation', 'Public Works'),
  ]),

  node('Environmetal Concerns', 'Public Works', [
    leaf('Illegal Discharge to Waterway/Canal/Swale', 'Public Works'),
    leaf('Endangered Protected Species', 'Public Works'),
    leaf('Dumping Hazardous Waste (Land-base only)', 'Public Works'),
    leaf('Dumping Yard Waste in Canal/Waterway', 'Public Works'),
    leaf('Fish Kill', 'Public Works'),
    leaf('Commercial Stormwater Discharges', 'Public Works'),
    leaf('Turbid Stormwater Discharges', 'Public Works'),
  ]),

  node('EOC Internal Request', 'Emergency Management', [
    leaf('EOC Drainage/Streets', 'Emergency Management'),
    leaf('EOC Push to Swale', 'Emergency Management'),
    leaf('EOC Traffic Control', 'Emergency Management'),
  ]),

  node('Graffiti/Vandalism', 'Parks & Recreation', [
    leaf('Private Property', 'Parks & Recreation'),
    node('Recreational Facility', 'Parks & Recreation', [
      leaf('Mid Florida Event Center', 'Parks & Recreation'),
      leaf('Community Center', 'Parks & Recreation'),
      leaf('Minsky Gym', 'Parks & Recreation'),
      leaf('Saints Golf Course', 'Parks & Recreation'),
      leaf('Botanical Gardens', 'Parks & Recreation'),
    ]),
    leaf('Park', 'Parks & Recreation'),
    leaf('Road / Sidewalk / Bridge / Bus Shelter', 'Parks & Recreation'),
    leaf('Light Pole/Signal Pole or Traffic Control Box', 'Parks & Recreation'),
  ]),

  node('Incidents', 'Office of Solid Waste', [
    leaf('Damaged Property', 'Office of Solid Waste'),
    leaf('Recycling Cart Replacement (RFS)', 'Office of Solid Waste'),
    leaf('Spill/leak', 'Office of Solid Waste'),
    leaf('FCC Driver Complaint', 'Office of Solid Waste'),
    leaf('Garbage Cart Replacement (RFS)', 'Office of Solid Waste'),
  ]),

  node('Landscape/Mowing Issues', 'Public Works', [
    leaf('Plant/Tree Maintenance', 'Public Works'),
    leaf('Property Damaged by Crews', 'Public Works'),
    leaf('Sprinkler/Irrigation Issues', 'Public Works'),
    leaf('Algae/Plants in Water', 'Public Works'),
    leaf('Overgrown Vacant Lot (City Property)', 'Public Works'),
    leaf('Right of Way Mowing', 'Public Works'),
    leaf('Road Median Landscaping', 'Public Works'),
    leaf('Canal/Waterway Right of Way mowing', 'Public Works'),
  ]),

  leaf('Lien Inquiry', 'Lien Services'),

  node('Litter', 'Office of Solid Waste', [
    leaf('Commercial Litter', 'Office of Solid Waste'),
    leaf('Litter on public property', 'Office of Solid Waste'),
  ]),

  node('Non-Emergency Issues', 'Police Department', [
    leaf('Improper Soliciting/Door to Door Sales', 'Police Department'),
    leaf('Low Speed Vehicles/Golf Carts', 'Police Department'),
    leaf('Boat Speeding', 'Police Department'),
    leaf('Loud Music/Noise', 'Police Department'),
    leaf('Vehicle Speeding/Aggressive Driver', 'Police Department'),
    leaf('Neighbor Disputes', 'Police Department'),
    leaf('PD Other', 'Police Department'),
    leaf('Traffic Backup on Roadways', 'Police Department'),
    leaf('Parking Issues', 'Police Department'),
  ]),

  node('Parks and Recreation Inquiry', 'Parks & Recreation', [
    leaf('Request maintenance for a little free library', 'Parks & Recreation'),
    leaf('Light Out (City Facility Only)', 'Parks & Recreation'),
    leaf('Fitness Equipment', 'Parks & Recreation'),
    leaf('Buildings Issue', 'Parks & Recreation'),
    leaf('Fields and Grounds Issue', 'Parks & Recreation'),
    leaf('Playground Issue', 'Parks & Recreation'),
    leaf('Tennis/Basketball Courts Issue', 'Parks & Recreation'),
    leaf('Litter/Trash Can', 'Parks & Recreation'),
    leaf('Parks & Rec Administration', 'Parks & Recreation'),
    leaf('Special Events Request', 'Parks & Recreation'),
  ]),

  node('Police Issues', 'Police Department', [
    leaf('Non-Emergency Issues', 'Police Department'),
    leaf('Emergency Issues', 'Police Department'),
  ]),

  node('Public Records Request', 'City Clerk', [
    leaf('General Records Request', 'City Clerk'),
    leaf('Request for Survey or Permit Records (Building Dept.)', 'City Clerk'),
  ]),

  node('Public Works Administration', 'Public Works', [
    leaf('General', 'Public Works'),
    leaf('Safety Concern', 'Public Works'),
    leaf('Residential Culvert Pipe Program Inspection', 'Public Works'),
    leaf('Property Protection Letter', 'Public Works'),
    leaf('Regulatory CDD Inquiry', 'Public Works'),
    leaf('Pressure Washing on Public Property', 'Public Works'),
  ]),

  node('Recreational Facility', 'Parks & Recreation', [
    leaf('Mid Florida Event Center', 'Parks & Recreation'),
    leaf('Community Center', 'Parks & Recreation'),
    leaf('Minsky Gym', 'Parks & Recreation'),
    leaf('Saints Golf Course', 'Parks & Recreation'),
    leaf('Botanical Gardens', 'Parks & Recreation'),
  ]),

  leaf('Reject to 311', 'Public Works'),

  node('Report an Issue', 'Office of Solid Waste', [
    leaf('Incidents', 'Office of Solid Waste'),
    leaf('Yard Waste', 'Office of Solid Waste'),
    leaf('Garbage/Trash', 'Office of Solid Waste'),
    leaf('Recycling', 'Office of Solid Waste'),
    leaf('Bulk Trash - furniture/appliances/etc.', 'Office of Solid Waste'),
    leaf('Illegal Dumping', 'Office of Solid Waste'),
  ]),

  node('Request for Service', 'Office of Solid Waste', [
    leaf('NEW Resident - Garbage & Recycling Cart', 'Office of Solid Waste'),
    leaf('Recycling Cart (RFS) - New Request', 'Office of Solid Waste'),
    leaf('Estimate Request (RFS) - Bulk/Yard Waste', 'Office of Solid Waste'),
    leaf('Garbage Cart (RFS) - Swap', 'Office of Solid Waste'),
    leaf('Garbage Cart (RFS) - New Request', 'Office of Solid Waste'),
    leaf('Garbage Cart (RFS) - Additional Cart', 'Office of Solid Waste'),
    leaf('Recycling Cart (RFS) - Additional Cart', 'Office of Solid Waste'),
  ]),

  node('Residential Construction Issues', 'Building', [
    leaf('Contractor Issues', 'Building'),
    leaf('Construction Debris', 'Building'),
    leaf('Unlicensed Contracting', 'Building'),
    leaf('Unpermitted Work', 'Building'),
    leaf('General Permit Questions', 'Building'),
    leaf('Construction Inspection Question/Issue', 'Building'),
    leaf('Silt Fence Issues', 'Building'),
    leaf('Construction Noise', 'Building'),
    leaf('Construction Dust', 'Building'),
    leaf('Construction Blocking Road', 'Building'),
    leaf('Construction Blocking Sidewalk', 'Building'),
    leaf('Residential Regulatory Drainage Escalation', 'Building'),
  ]),

  node('Sidewalk Issue', 'Public Works', [
    leaf('Sidewalk Request', 'Public Works'),
    leaf('Sidewalk Repair', 'Public Works'),
  ]),

  node('Solid Waste (Garbage/Recycling/Yard Waste)', 'Office of Solid Waste', [
    leaf('One Time Courtesy Collection', 'Office of Solid Waste'),
    leaf('Citation Estimate', 'Office of Solid Waste'),
    leaf('City Removal Request', 'Office of Solid Waste'),
    leaf('Cameo Closures', 'Office of Solid Waste'),
    leaf('Report an Issue', 'Office of Solid Waste'),
    leaf('Request for Service', 'Office of Solid Waste'),
    leaf('Solid Waste Miscellaneous', 'Office of Solid Waste'),
  ]),

  node('Street Issue', 'Public Works', [
    leaf('Street Sweeper Needed', 'Public Works'),
    leaf('Debris in Roadway', 'Public Works'),
    leaf('Pavement Repair', 'Public Works'),
    leaf('Repaving', 'Public Works'),
    leaf('Pothole', 'Public Works'),
  ]),

  node('Swale Liner Issues', 'Public Works', [
    leaf('Swale Liner Cleaning', 'Public Works'),
    leaf('Crews Left Debris on Property', 'Public Works'),
  ]),

  leaf('TEST', 'Information Technology'),

  node('Traffic Operations', 'Public Works', [
    leaf('Adopt-A-Street Road Sign', 'Public Works'),
    leaf('Roadway Access Management', 'Public Works'),
    leaf('Graffiti on Traffic Facility', 'Public Works'),
    leaf('Pavement Marking/Striping', 'Public Works'),
    leaf('Road Sign', 'Public Works'),
    leaf('School Zone/Crosswalk Flasher', 'Public Works'),
    leaf('Street Light Repair', 'Public Works'),
    leaf('Traffic Control Box', 'Public Works'),
    leaf('Traffic Signal', 'Public Works'),
    leaf('Traffic Calming Request', 'Public Works'),
  ]),

  node('Utility Systems Issue', 'Utility Systems', [
    leaf('Sewer Issues', 'Utility Systems'),
    leaf('Drinking Water Issues', 'Utility Systems'),
    leaf('USD Administration', 'Utility Systems'),
    leaf('Billing Question', 'Utility Systems'),
  ]),
];
