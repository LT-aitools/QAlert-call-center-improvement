import type { Submitter, RelatedRequest, RequestType } from '../types/qalert';

export const mockSubmitters: Submitter[] = [
  // Jane Doe variants — so searching "jane" or "doe" returns multiple
  {
    id: '1',
    firstName: 'Jane', lastName: 'Doe', mi: '',
    address: '133 SW Cameo Blvd', city: 'Port St. Lucie', state: 'FL', zip: '34953',
    email: 'jdoe.psl@gmail.com', phone: '772-555-0191', unit: '',
    notificationPrefs: { primaryPhone: false, primaryVoice: false, primaryText: false, primaryEmail: false, alternatePhone: false, alternateVoice: false, alternateText: false, alternateEmail: false },
  },
  {
    id: '2',
    firstName: 'Jane', lastName: 'Doe', mi: 'A',
    address: '2814 SE Melaleuca Blvd', city: 'Port St. Lucie', state: 'FL', zip: '34952',
    email: 'jane.doe.2@outlook.com', phone: '772-555-0342', unit: 'Apt 4B',
    notificationPrefs: { primaryPhone: false, primaryVoice: false, primaryText: false, primaryEmail: false, alternatePhone: false, alternateVoice: false, alternateText: false, alternateEmail: false },
  },
  {
    id: '3',
    firstName: 'Jane', lastName: 'Doe', mi: '',
    address: '1892 SW Capehart Ave', city: 'Port St. Lucie', state: 'FL', zip: '34984',
    email: '', phone: '772-555-0587', unit: '',
    notificationPrefs: { primaryPhone: false, primaryVoice: false, primaryText: false, primaryEmail: false, alternatePhone: false, alternateVoice: false, alternateText: false, alternateEmail: false },
  },
  // Other Janes
  {
    id: '4',
    firstName: 'Jane', lastName: 'Smith', mi: 'R',
    address: '450 NW Fork Rd', city: 'Port St. Lucie', state: 'FL', zip: '34990',
    email: 'jsmith.psl@yahoo.com', phone: '772-555-0214', unit: '',
    notificationPrefs: { primaryPhone: false, primaryVoice: false, primaryText: false, primaryEmail: false, alternatePhone: false, alternateVoice: false, alternateText: false, alternateEmail: false },
  },
  {
    id: '5',
    firstName: 'Jane', lastName: 'Miller', mi: '',
    address: '7200 S US-1', city: 'Port St. Lucie', state: 'FL', zip: '34952',
    email: 'jane.miller@hotmail.com', phone: '772-555-0478', unit: 'Unit 12',
    notificationPrefs: { primaryPhone: false, primaryVoice: false, primaryText: false, primaryEmail: false, alternatePhone: false, alternateVoice: false, alternateText: false, alternateEmail: false },
  },
  // Other Does
  {
    id: '6',
    firstName: 'John', lastName: 'Doe', mi: 'B',
    address: '123 SW Cashmere Blvd', city: 'Port St. Lucie', state: 'FL', zip: '34953',
    email: 'j.doe.johnd@gmail.com', phone: '772-555-0033', unit: '',
    notificationPrefs: { primaryPhone: false, primaryVoice: false, primaryText: false, primaryEmail: false, alternatePhone: false, alternateVoice: false, alternateText: false, alternateEmail: false },
  },
  {
    id: '7',
    firstName: 'Mary', lastName: 'Doe', mi: '',
    address: '980 SE Lennard Rd', city: 'Port St. Lucie', state: 'FL', zip: '34952',
    email: 'marydoe.florida@gmail.com', phone: '772-555-0712', unit: '',
    notificationPrefs: { primaryPhone: false, primaryVoice: false, primaryText: false, primaryEmail: false, alternatePhone: false, alternateVoice: false, alternateText: false, alternateEmail: false },
  },
  // Other residents
  {
    id: '8',
    firstName: 'Robert', lastName: 'Johnson', mi: 'T',
    address: '3401 SW Savona Blvd', city: 'Port St. Lucie', state: 'FL', zip: '34953',
    email: 'rjohnson.psl@gmail.com', phone: '772-555-0855', unit: '',
    notificationPrefs: { primaryPhone: false, primaryVoice: false, primaryText: false, primaryEmail: false, alternatePhone: false, alternateVoice: false, alternateText: false, alternateEmail: false },
  },
  {
    id: '9',
    firstName: 'Sarah', lastName: 'Williams', mi: '',
    address: '1501 SW Cameo Blvd', city: 'Port St. Lucie', state: 'FL', zip: '34953',
    email: 's.williams.fl@outlook.com', phone: '772-555-0293', unit: '',
    notificationPrefs: { primaryPhone: false, primaryVoice: false, primaryText: false, primaryEmail: false, alternatePhone: false, alternateVoice: false, alternateText: false, alternateEmail: false },
  },
  {
    id: '10',
    firstName: 'Michael', lastName: 'Brown', mi: 'L',
    address: '621 NW Lake Whitney Pl', city: 'Port St. Lucie', state: 'FL', zip: '34986',
    email: 'mbrown.psl@yahoo.com', phone: '772-555-0164', unit: '',
    notificationPrefs: { primaryPhone: false, primaryVoice: false, primaryText: false, primaryEmail: false, alternatePhone: false, alternateVoice: false, alternateText: false, alternateEmail: false },
  },
  {
    id: '11',
    firstName: 'Emily', lastName: 'Davis', mi: '',
    address: '4576 SW Adamar Blvd', city: 'Port St. Lucie', state: 'FL', zip: '34953',
    email: 'emily.davis.fl@gmail.com', phone: '772-555-0921', unit: 'Apt 2A',
    notificationPrefs: { primaryPhone: false, primaryVoice: false, primaryText: false, primaryEmail: false, alternatePhone: false, alternateVoice: false, alternateText: false, alternateEmail: false },
  },
  {
    id: '12',
    firstName: 'Carlos', lastName: 'Martinez', mi: 'A',
    address: '882 SE Tidewater Cove', city: 'Port St. Lucie', state: 'FL', zip: '34952',
    email: 'cmartinez.psl@gmail.com', phone: '772-555-0647', unit: '',
    notificationPrefs: { primaryPhone: false, primaryVoice: false, primaryText: false, primaryEmail: false, alternatePhone: false, alternateVoice: false, alternateText: false, alternateEmail: false },
  },
];

// Tickets keyed by submitter id — loaded into right panel when a submitter is selected
export const mockTicketsBySubmitter: Record<string, RelatedRequest[]> = {
  '1': [ // Jane Doe (133 SW Cameo)
    { id: '114728', priority: 2, address: '1501 SW Cameo Blvd, Port St. Lucie', lastAction: '7/9/2024 10:37P', requestType: 'Cameo Closures', submitter: 'Jane Doe', createdOn: '7/9/2024 10:33P', routedTo: 'flora.tierman,August Wieser,RLouw', status: 'Open' },
    { id: '112648', priority: 2, address: '1501 SW Cameo Blvd, Port St. Lucie', lastAction: '7/9/2024 10:33P', requestType: 'Cameo Closures', submitter: 'Jane Doe', createdOn: '7/9/2024 10:33P', routedTo: 'Marcus Webb', status: 'Open' },
    { id: '41976',  priority: 2, address: '2814 SE Melaleuca Blvd, Port St. Lucie', lastAction: '7/22/2022 8:23P', requestType: 'Garbage/Trash', submitter: 'Jane Doe', createdOn: '7/22/2022 8:23P', routedTo: 'TNorris,Diane Castellano,j.okafor,S Prentiss', status: 'Closed' },
    { id: '17698',  priority: 2, address: '1892 SW Capehart Ave, Port St. Lucie', lastAction: '4/14/2021 3:33P', requestType: 'Other Code Issue', submitter: 'Jane Doe', createdOn: '4/14/2021 3:33P', routedTo: 'BVelasquez,Priya Nair,r.sanchezlopez,Carl Huang,AFeatherstone', status: 'Closed' },
    { id: '6671',   priority: 2, address: '123 SW Cashmere Blvd, Port St. Lucie', lastAction: '3/19/2020 3:39P', requestType: 'Swale Rework', submitter: 'Jane Doe', createdOn: '3/19/2020 3:39P', routedTo: 'kevin.marshall', status: 'Closed' },
  ],
  '2': [ // Jane Doe A (2814 SE Melaleuca)
    { id: '98341',  priority: 3, address: '2814 SE Melaleuca Blvd, Port St. Lucie', lastAction: '11/3/2023 2:14P', requestType: 'Pothole', submitter: 'Jane Doe A', createdOn: '11/3/2023 2:10P', routedTo: 'r.sanchezlopez', status: 'Closed' },
    { id: '87204',  priority: 2, address: '2814 SE Melaleuca Blvd, Port St. Lucie', lastAction: '5/21/2022 9:47A', requestType: 'Flooding', submitter: 'Jane Doe A', createdOn: '5/21/2022 9:44A', routedTo: 'TNorris,S Prentiss', status: 'Closed' },
  ],
  '3': [ // Jane Doe (1892 SW Capehart)
    { id: '103567', priority: 1, address: '1892 SW Capehart Ave, Port St. Lucie', lastAction: '2/7/2024 4:55P', requestType: 'Junk/Debris', submitter: 'Jane Doe', createdOn: '2/7/2024 4:50P', routedTo: 'BVelasquez', status: 'In Progress' },
    { id: '91823',  priority: 2, address: '1892 SW Capehart Ave, Port St. Lucie', lastAction: '8/12/2023 11:22A', requestType: 'Swale Rework', submitter: 'Jane Doe', createdOn: '8/12/2023 11:18A', routedTo: 'kevin.marshall,August Wieser', status: 'Closed' },
  ],
  '6': [ // John Doe B
    { id: '107441', priority: 2, address: '123 SW Cashmere Blvd, Port St. Lucie', lastAction: '4/19/2024 1:30P', requestType: 'Abandoned Vehicle', submitter: 'John Doe', createdOn: '4/19/2024 1:28P', routedTo: 'AFeatherstone', status: 'Open' },
    { id: '99012',  priority: 3, address: '123 SW Cashmere Blvd, Port St. Lucie', lastAction: '9/5/2023 3:12P', requestType: 'Graffiti/Vandalism', submitter: 'John Doe', createdOn: '9/5/2023 3:09P', routedTo: 'flora.tierman', status: 'On Hold' },
    { id: '78341',  priority: 2, address: '123 SW Cashmere Blvd, Port St. Lucie', lastAction: '1/14/2022 10:05A', requestType: 'Boat/RV Parking', submitter: 'John Doe', createdOn: '1/14/2022 10:02A', routedTo: 'RLouw,Marcus Webb', status: 'Closed' },
  ],
  '8': [ // Robert Johnson
    { id: '110234', priority: 2, address: '3401 SW Savona Blvd, Port St. Lucie', lastAction: '6/3/2024 8:44A', requestType: 'Canal/Waterway', submitter: 'Robert Johnson', createdOn: '6/3/2024 8:40A', routedTo: 'Diane Castellano,j.okafor', status: 'In Progress' },
  ],
  '9': [ // Sarah Williams
    { id: '115001', priority: 1, address: '1501 SW Cameo Blvd, Port St. Lucie', lastAction: '8/15/2024 3:20P', requestType: 'Pothole', submitter: 'Sarah Williams', createdOn: '8/15/2024 3:18P', routedTo: 'August Wieser', status: 'Open' },
    { id: '108762', priority: 2, address: '1501 SW Cameo Blvd, Port St. Lucie', lastAction: '5/29/2024 12:55P', requestType: 'Flooding', submitter: 'Sarah Williams', createdOn: '5/29/2024 12:50P', routedTo: 'TNorris,kevin.marshall', status: 'Closed' },
    { id: '94411',  priority: 3, address: '1501 SW Cameo Blvd, Port St. Lucie', lastAction: '10/10/2023 5:05P', requestType: 'Swale', submitter: 'Sarah Williams', createdOn: '10/10/2023 5:01P', routedTo: 'r.sanchezlopez', status: 'Closed' },
  ],
};

export const mockRelatedRequests: RelatedRequest[] = [
  {
    id: '114728', priority: 2, address: '1501 SW Cameo Blvd, Port St. Lucie',
    lastAction: '7/9/2024 10:37P', requestType: 'Cameo Closures',
    submitter: 'Jane Doe Resident', createdOn: '7/9/2024 10:33P',
    routedTo: 'flora.tierman,August Wieser,RLouw', status: 'Open',
  },
  {
    id: '112648', priority: 2, address: '1501 SW Cameo Blvd, Port St. Lucie',
    lastAction: '7/9/2024 10:33P', requestType: 'Cameo Closures',
    submitter: 'Jane Doe', createdOn: '7/9/2024 10:33P',
    routedTo: 'Marcus Webb', status: 'Open',
  },
  {
    id: '41976', priority: 2, address: '2814 SE Melaleuca Blvd, Port St. Lucie',
    lastAction: '7/22/2022 8:23P', requestType: 'Garbage/Trash',
    submitter: 'Jane Doe', createdOn: '7/22/2022 8:23P',
    routedTo: 'TNorris,Diane Castellano,j.okafor,S Prentiss', status: 'Closed',
  },
  {
    id: '17698', priority: 2, address: '1892 SW Capehart Ave, Port St. Lucie',
    lastAction: '4/14/2021 3:33P', requestType: 'Other Code Issue',
    submitter: 'Jane Doe', createdOn: '4/14/2021 3:33P',
    routedTo: 'BVelasquez,Priya Nair,r.sanchezlopez,Carl Huang,AFeatherstone', status: 'Closed',
  },
  {
    id: '6671', priority: 2, address: '123 SW Cashmere Blvd, Port St. Lucie',
    lastAction: '3/19/2020 3:39P', requestType: 'Swale Rework',
    submitter: 'Jane Doe', createdOn: '3/19/2020 3:39P',
    routedTo: 'kevin.marshall', status: 'Closed',
  },
];

// Full searchable ticket database for Request Search tab
export const mockSearchTickets: RelatedRequest[] = [
  { id: '164677', priority: 1, address: '782 SW Deacon Dr, Port St. Lucie',        lastAction: '4/14/2026 9:17P',  requestType: 'Swale Rework',        submitter: 'Michael Brown',   createdOn: '4/14/2026 9:12P',  routedTo: 'TNorris',                   status: 'Open',        dept: 'Public Works',    origin: 'Call Center', submitterId: '10' },
  { id: '163969', priority: 1, address: '3341 NW Glorian Ave, Port St. Lucie',     lastAction: '4/12/2026 11:02A', requestType: 'Pothole',             submitter: 'Carlos Martinez', createdOn: '4/12/2026 10:58A', routedTo: 'August Wieser',             status: 'Open',        dept: 'Public Works',    origin: 'Online',      submitterId: '12' },
  { id: '164472', priority: 1, address: '509 SE Whitmore Dr, Port St. Lucie',      lastAction: '4/13/2026 2:30P',  requestType: 'Abandoned Vehicle',   submitter: 'Emily Davis',     createdOn: '4/13/2026 2:25P',  routedTo: 'AFeatherstone',             status: 'Open',        dept: 'Code Compliance', origin: 'Call Center', submitterId: '11' },
  { id: '163577', priority: 1, address: '1876 SW Paar Dr, Port St. Lucie',         lastAction: '4/11/2026 4:45P',  requestType: 'Flooding',            submitter: 'Sarah Williams',  createdOn: '4/11/2026 4:40P',  routedTo: 'TNorris,kevin.marshall',    status: 'In Progress', dept: 'Public Works',    origin: 'Call Center', submitterId: '9'  },
  { id: '164055', priority: 1, address: '714 NW Brisson Ave, Port St. Lucie',      lastAction: '4/9/2026 6:04P',   requestType: 'Building Permit',     submitter: 'Robert Johnson',  createdOn: '4/9/2026 6:00P',   routedTo: 'Diane Castellano',          status: 'In Progress', dept: 'Building',        origin: 'Call Center', submitterId: '8'  },
  { id: '163501', priority: 1, address: '2253 SW Mayflower Ave, Port St. Lucie',   lastAction: '4/10/2026 1:15P',  requestType: 'Street Light Outage', submitter: 'Jane Doe',        createdOn: '4/10/2026 1:10P',  routedTo: 'flora.tierman',             status: 'Open',        dept: 'Public Works',    origin: 'Call Center', submitterId: '1'  },
  { id: '164656', priority: 1, address: '4087 SE Westmoreland Blvd, Port St. Lucie', lastAction: '4/14/2026 7:22P', requestType: 'Graffiti/Vandalism', submitter: 'John Doe',       createdOn: '4/14/2026 7:18P',  routedTo: 'RLouw',                     status: 'Open',        dept: 'Code Compliance', origin: 'Online',      submitterId: '6'  },
  { id: '163831', priority: 1, address: '639 NW Ondich Rd, Port St. Lucie',        lastAction: '4/12/2026 9:50A',  requestType: 'Canal/Waterway',      submitter: 'Mary Doe',        createdOn: '4/12/2026 9:46A',  routedTo: 'j.okafor,S Prentiss',       status: 'Open',        dept: 'Public Works',    origin: 'Call Center', submitterId: '7'  },
  { id: '164106', priority: 1, address: '5530 SW Becker Rd, Port St. Lucie',       lastAction: '4/10/2026 3:33P',  requestType: 'Junk/Debris',         submitter: 'Carlos Martinez', createdOn: '4/10/2026 3:28P',  routedTo: 'BVelasquez',                status: 'In Progress', dept: 'Code Compliance', origin: 'Email',       submitterId: '12' },
  { id: '163963', priority: 1, address: '188 NW Dunbar Ave, Port St. Lucie',       lastAction: '4/12/2026 10:05A', requestType: 'Swale',               submitter: 'Jane Smith',      createdOn: '4/12/2026 10:00A', routedTo: 'r.sanchezlopez',            status: 'Open',        dept: 'Public Works',    origin: 'Call Center', submitterId: '4'  },
  { id: '163785', priority: 1, address: '2914 SW Fondura Rd, Port St. Lucie',      lastAction: '4/11/2026 8:44A',  requestType: 'Boat/RV Parking',     submitter: 'Emily Davis',     createdOn: '4/11/2026 8:40A',  routedTo: 'AFeatherstone,Marcus Webb', status: 'Open',        dept: 'Code Compliance', origin: 'Call Center', submitterId: '11' },
  { id: '163820', priority: 1, address: '417 SE Lennox Ave, Port St. Lucie',       lastAction: '4/11/2026 5:30P',  requestType: 'Pothole',             submitter: 'Robert Johnson',  createdOn: '4/11/2026 5:26P',  routedTo: 'August Wieser',             status: 'In Progress', dept: 'Public Works',    origin: 'Online',      submitterId: '8'  },
  { id: '163655', priority: 1, address: '8820 SW Torrijos Ct, Port St. Lucie',     lastAction: '4/11/2026 11:14A', requestType: 'Culvert',             submitter: 'Michael Brown',   createdOn: '4/11/2026 11:10A', routedTo: 'TNorris',                   status: 'Open',        dept: 'Public Works',    origin: 'Call Center', submitterId: '10' },
  { id: '163718', priority: 1, address: '1103 NW Gaynor Ave, Port St. Lucie',      lastAction: '4/11/2026 2:05P',  requestType: 'Other Code Issue',    submitter: 'Jane Doe A',      createdOn: '4/11/2026 2:00P',  routedTo: 'BVelasquez,Priya Nair',     status: 'Open',        dept: 'Code Compliance', origin: 'Call Center', submitterId: '2'  },
  { id: '163208', priority: 1, address: '326 SE Floresta Dr, Port St. Lucie',      lastAction: '4/9/2026 12:18P',  requestType: 'Garbage/Trash',       submitter: 'Sarah Williams',  createdOn: '4/9/2026 12:14P',  routedTo: 'kevin.marshall',            status: 'Closed',      dept: 'Public Works',    origin: 'Call Center', submitterId: '9'  },
  { id: '164150', priority: 1, address: '7741 NW Haverhill Rd, Port St. Lucie',    lastAction: '4/10/2026 4:55P',  requestType: 'Flooding',            submitter: 'Jane Miller',     createdOn: '4/10/2026 4:50P',  routedTo: 'TNorris,S Prentiss',        status: 'Open',        dept: 'Public Works',    origin: 'Online',      submitterId: '5'  },
  { id: '164036', priority: 1, address: '2268 SE Morningside Blvd, Port St. Lucie',lastAction: '4/9/2026 8:30P',   requestType: 'Swale Rework',        submitter: 'John Doe',        createdOn: '4/9/2026 8:26P',   routedTo: 'RLouw,flora.tierman',       status: 'In Progress', dept: 'Public Works',    origin: 'Call Center', submitterId: '6'  },
  { id: '163734', priority: 1, address: '493 NW Layton Rd, Port St. Lucie',        lastAction: '4/11/2026 6:10P',  requestType: 'Abandoned Vehicle',   submitter: 'Michael Brown',   createdOn: '4/11/2026 6:06P',  routedTo: 'AFeatherstone',             status: 'Open',        dept: 'Code Compliance', origin: 'Call Center', submitterId: '10' },
  { id: '163236', priority: 1, address: '6615 SW Winding Lakes Blvd, Port St. Lucie', lastAction: '4/9/2026 9:44A', requestType: 'Pothole',            submitter: 'Carlos Martinez', createdOn: '4/9/2026 9:40A',   routedTo: 'August Wieser',             status: 'Closed',      dept: 'Public Works',    origin: 'Online',      submitterId: '12' },
  { id: '164820', priority: 2, address: '3302 NW Selvitz Rd, Port St. Lucie',      lastAction: '4/15/2026 8:05A',  requestType: 'Junk/Debris',         submitter: 'Jane Doe',        createdOn: '4/15/2026 8:00A',  routedTo: 'BVelasquez',                status: 'Open',        dept: 'Code Compliance', origin: 'Call Center', submitterId: '1'  },
  { id: '164819', priority: 2, address: '851 SE Walton Rd, Port St. Lucie',        lastAction: '4/15/2026 7:48A',  requestType: 'Street Light Outage', submitter: 'Jane Smith',      createdOn: '4/15/2026 7:44A',  routedTo: 'flora.tierman',             status: 'Open',        dept: 'Public Works',    origin: 'Call Center', submitterId: '4'  },
  { id: '164519', priority: 2, address: '1559 SW Aster Rd, Port St. Lucie',        lastAction: '4/13/2026 3:22P',  requestType: 'Canal/Waterway',      submitter: 'Emily Davis',     createdOn: '4/13/2026 3:18P',  routedTo: 'j.okafor',                  status: 'In Progress', dept: 'Public Works',    origin: 'Email',       submitterId: '11' },
  { id: '164818', priority: 2, address: '4773 NW Dunn Rd, Port St. Lucie',         lastAction: '4/15/2026 7:30A',  requestType: 'Graffiti/Vandalism',  submitter: 'Robert Johnson',  createdOn: '4/15/2026 7:26A',  routedTo: 'RLouw',                     status: 'Open',        dept: 'Code Compliance', origin: 'Call Center', submitterId: '8'  },
  { id: '164817', priority: 2, address: '228 SE Crossroads Pkwy, Port St. Lucie',  lastAction: '4/15/2026 7:12A',  requestType: 'Culvert',             submitter: 'Mary Doe',        createdOn: '4/15/2026 7:08A',  routedTo: 'TNorris',                   status: 'On Hold',     dept: 'Public Works',    origin: 'Call Center', submitterId: '7'  },
  { id: '164816', priority: 2, address: '9140 SW Orchid Isle Dr, Port St. Lucie',  lastAction: '4/15/2026 6:55A',  requestType: 'Swale',               submitter: 'Jane Doe',        createdOn: '4/15/2026 6:50A',  routedTo: 'r.sanchezlopez',            status: 'Closed',      dept: 'Public Works',    origin: 'Online',      submitterId: '1'  },
  { id: '555555', priority: 2, address: '248 SW Glenwood Dr, Port St. Lucie',      lastAction: '4/1/2026 10:00A',  requestType: 'Pothole',             submitter: 'Jane Doe',        createdOn: '4/1/2026 9:55A',   routedTo: 'kevin.marshall',            status: 'Closed',      dept: 'Public Works',    origin: 'Call Center', submitterId: '1'  },
];

export const mockRequestTypes: RequestType[] = [
  { id: 'a-info',       label: 'A Info/Alerta',                          department: 'Call Center' },
  { id: 'animal',       label: 'Animal Issues',                          department: 'Animal Services' },
  { id: 'ask-us',       label: 'Ask Us',                                 department: 'Call Center' },
  { id: 'bldg-dept',    label: 'Building Department Administration',      department: 'Building' },
  { id: 'biz-inquiry',  label: 'Business Inquiry',                       department: 'Economic Dev' },
  { id: 'biz-nav',      label: 'Business Navigator',                     department: 'Economic Dev' },
  { id: 'city-council', label: 'City Council Administrative Request',     department: 'City Council' },
  { id: 'city-mgr',     label: 'City Manager Administrative Request',     department: 'City Manager' },
  { id: 'city-projects',label: 'City Projects',                          department: 'Public Works' },
  { id: 'code-compliance', label: 'Code Compliance/Code Issues',         department: 'Code Compliance',
    subTypes: [
      { id: 'cc-abandoned', label: 'Abandoned Vehicle',   department: 'Code Compliance' },
      { id: 'cc-boat',      label: 'Boat/RV Parking',     department: 'Code Compliance' },
      { id: 'cc-junk',      label: 'Junk/Debris',         department: 'Code Compliance' },
      { id: 'cc-swale',     label: 'Swale Rework',        department: 'Code Compliance' },
    ]
  },
  { id: 'drainage', label: 'Drainage Issue', department: 'Public Works',
    subTypes: [
      { id: 'd-canal',    label: 'Canal/Waterway', department: 'Public Works' },
      { id: 'd-culvert',  label: 'Culvert',        department: 'Public Works' },
      { id: 'd-flooding', label: 'Flooding',       department: 'Public Works' },
      { id: 'd-swale',    label: 'Swale',          department: 'Public Works' },
    ]
  },
  { id: 'env-concerns', label: 'Environmental Concerns', department: 'Public Works' },
  { id: 'graffiti',     label: 'Graffiti/Vandalism',     department: 'Code Compliance' },
];
