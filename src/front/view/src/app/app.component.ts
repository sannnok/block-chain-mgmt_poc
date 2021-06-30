import { Component, ElementRef, ViewChild } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

const BURL = "http://localhost:3000/parse/";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'view';
  loading = false;

  addOnBlur = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  addrCtrl = new FormControl();
  filteredAddresses: Observable<string[]>;
  addresses: string[] = [];
  allCachedAddresses: string[] = ['0x45245aCA2e6b1141dc20fad9c5910DDE0A454Bf8', '0x72f5db1a91a6c78f4c7a83793ca4ee775e86be10', '0xB7c3a71e2F6358986C4bA67473EA54eB40E39054'];
  textAreaData: any = '';

  @ViewChild('addrInput') addrInput!: ElementRef<HTMLInputElement>;

  constructor(private http: HttpClient, private _snackBar: MatSnackBar) {
    this.filteredAddresses = this.addrCtrl.valueChanges.pipe(
        startWith(null),
        map((fruit: string | null) => fruit ? this._filter(fruit) : this.allCachedAddresses.slice()));
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    const spaceDetected = value.indexOf(' ') > -1;
    const commaDetected = value.indexOf(',') > -1;

    // Add list of our addrs
    if (commaDetected || spaceDetected) {
      const values = new Set(value.split(commaDetected ? ',' : /\s+/));
      values.forEach(v => {
        if (!v) return;
        this.addresses.push(v.trim())
      });
    } else {
      // Add our addr
      if (value) {
        this.addresses.push(value);
      }
    }


    // Clear the input value
    event.chipInput!.clear();

    this.addrCtrl.setValue(null);

    this.addresses = [...new Set(this.addresses)]
  }

  remove(addr: string): void {
    const index = this.addresses.indexOf(addr);

    if (index >= 0) {
      this.addresses.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.addresses.push(event.option.viewValue);
    this.addrInput.nativeElement.value = '';
    this.addrCtrl.setValue(null);
  }

  go() {
    this.textAreaData = '';

    this.loading = true;
    this.http.post(BURL, this.addresses).subscribe(addrs => {
      this.loading = false;
      this.textAreaData = addrs;
    });
  }

  copyAll() {
    if (this.textAreaData) {
      this._snackBar.open('Successsfully copied to clipboard! 🍕', 'N1', { duration: 3000 });
      return;
    }
    this._snackBar.open('No Data retrieved! ☹', 'W1', { duration: 3000 });
  }

  getStringifiedData() {
    return JSON.stringify(this.textAreaData);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allCachedAddresses.filter(fruit => fruit.toLowerCase().includes(filterValue));
  }
}
