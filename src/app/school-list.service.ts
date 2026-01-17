import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { tap } from "rxjs";

export interface School {
  area: string;
  district: string;
  email: string;
  fax_number: string;
  lat: number;
  lng: number;
  municipal_unit: string;
  municipality: string;
  phone_number: string;
  prefecture: string;
  regional_unit: string;
  school_code: string;
  school_district: null;
  school_name: string;
  school_subtype: string;
  school_type: string;
  street_address: string;
  zip_code: string;
}

@Injectable({ providedIn: 'root' })
export class SchoolListService {
  private readonly http = inject(HttpClient);

  getSchools() {
    return this.http
      .get<School[]>('https://data.gov.gr/api/v1/query/minedu_schools')
      .pipe(tap((res) => console.log(res)));
  }
}