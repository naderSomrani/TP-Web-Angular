import { Component, OnInit, ViewChild, Inject} from '@angular/core';
import { Router } from '@angular/router';
import { HomeService } from './home.service';
import { Customer } from './home.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

export interface CustomersElement {
  avatar: string;
  first_name: string;
  last_name: string;
  address: string;
  city: string;
  state: string;
  order_total: Number;
}

export interface DialogData {
  id: string;
  first_name: string;
  last_name: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  data: Customer[];
  dataSource = new MatTableDataSource(this.data);
  displayedColumns: string[] = ['avatar', 'first_name', 'last_name', 'address', 'city', 'state', 'order_total', 'delete'];
  columnsToDisplay: string[] = this.displayedColumns.slice();

  constructor(private router: Router,
              private homeService: HomeService,
              public dialog: MatDialog) { }

  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
    this.getCustomersData();
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getCustomersData() {
    this.homeService.getCustomers().subscribe(data => {
      this.data = data;
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.sort = this.sort;
      console.log(data);
    });
  }

  addCustomer() {
    this.router.navigate(['add-customer']);
  }

  editCustomer(id: string) {
    this.router.navigate(['add-customer'], {queryParams: {
      id: id
    }});
  }

  deleteCustomer(id, first_name, last_name) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {id: id, first_name: first_name, last_name: last_name}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.homeService.deleteCustomer(result).subscribe(data => {
        console.log(data);
        this.router.routeReuseStrategy.shouldReuseRoute = function () {
          return false;
        };
        this.router.navigate(['home']);
      });
    });
  }
}

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: 'confirm-dialog.html',
})
export class ConfirmDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
