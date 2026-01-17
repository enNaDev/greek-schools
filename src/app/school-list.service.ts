import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { tap } from "rxjs";

export interface School {
  area: string; // Περιοχή
  district: string; // Δημοτική Ενότητα
  email: string; // e-mail
  fax_number: string; // ΦΑΞ
  lat: number; // Γεωγραφικό Πλάτος
  lng: number; // Γεωγραφικό Μήκος
  municipal_unit: string; // Δήμος
  municipality: string; // Κοινότητα
  phone_number: string; // Τηλέφωνο
  prefecture: string; // Νομός
  regional_unit: string; // Περιφέρεια
  school_code: string; // Κωδ. ΥΠΑΙΘ
  school_district: null; // Διεύθυνση π.χ. ΔΙΕΥΘΥΝΣΗ Π.Ε. ΦΩΚΙΔΑΣ
  school_name: string; // Ονομασία
  school_subtype: string; // Τύπος Σχολείου
  school_type: string; // Είδος
  street_address: string; // Ταχ. Διεύθυνση
  zip_code: string; // ΤΚ
}

export interface MetaData {
  identifier: string;
  name: string;
  files: any[];
  description: string;
  tags: any[];
  created_on: string;
  data_last_update: string;
  data_start_date: string;
  data_type: string;
  provider: Provider;
  topic: Topic;
  statistics: Statistic[];
  auto_rating: AutoRating;
  date_filter_max_days: any;
  detail_plot_title: any;
  license_name: any;
  license_url: any;
  license_text: any;
  fields: Field[];
  sample: Sample[];
  user_rated: any;
}

export interface Provider {
  identifier: string;
  name: string;
}

export interface Topic {
  identifier: string;
  name: string;
  description: string;
}

export interface Statistic {
  statistic: string;
  value: number;
}

export interface AutoRating {
  open_license: number;
  structured_data: number;
  open_format: number;
  constant_url: number;
  linked_data: number;
  total: number;
}

export interface Field {
  name: string;
  order: number;
  title: string;
  datatype: string;
  unit: any;
  description: any;
}

export interface Sample {
  regional_unit: string;
  school_district?: string;
  prefecture: string;
  municipal_unit: string;
  district: string;
  municipality: string;
  school_type: string;
  school_subtype: string;
  school_code: string;
  school_name: string;
  phone_number: string;
  fax_number?: string;
  email?: string;
  area?: string;
  street_address: string;
  zip_code: string;
  lat?: number;
  lng?: number;
}

@Injectable({ providedIn: 'root' })
export class SchoolListService {
  private readonly http = inject(HttpClient);

  getMetaData() {
    return this.http.get<MetaData>('https://data.gov.gr/api/v1/datasets/minedu_schools');
  }

  getSchools() {
    return this.http
      .get<School[]>('https://data.gov.gr/api/v1/query/minedu_schools')
      .pipe(tap((res) => console.log(res)));
  }
}