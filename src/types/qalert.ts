export interface Ticket {
  id: string;
  requestType: string;
  department: string;
  status: 'Open' | 'Closed' | 'Pending' | 'Duplicate';
  caller: {
    name: string;
    phone: string;
    address?: string;
  };
  notes: string;
  createdAt: string;
}

export interface RequestType {
  id: string;
  label: string;
  department: string;
  subTypes?: RequestType[];
}

export interface Submitter {
  id: string;
  firstName: string;
  lastName: string;
  mi?: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  email?: string;
  phone?: string;
  altPhone?: string;
  phoneExt?: string;
  altPhoneExt?: string;
  unit?: string;
  notificationPrefs: {
    primaryPhone: boolean;
    primaryVoice: boolean;
    primaryText: boolean;
    primaryEmail: boolean;
    alternatePhone: boolean;
    alternateVoice: boolean;
    alternateText: boolean;
    alternateEmail: boolean;
  };
}

export interface RelatedRequest {
  id: string;
  priority: number;
  address: string;
  lastAction: string;
  requestType: string;
  submitter: string;
  createdOn: string;
  routedTo: string;
  status: string;
  dept?: string;
  origin?: string;
  submitterId?: string;
  /** Public / call-center comments shown on the What tab when loading an existing ticket */
  comments?: string;
}

export type FormTab = 'who' | 'what' | 'where' | 'more' | 'history';
