import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeService } from '../home/home.service';
import { Customer } from '../home/home.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

class ImageSnippet {
  constructor(public src: string, public file: File) {}
}

@Component({
  selector: 'app-add-customer',
  templateUrl: './add-customer.component.html',
  styleUrls: ['./add-customer.component.css']
})
export class AddCustomerComponent implements OnInit {
  selectedFile: ImageSnippet;

  id = '';
  customer: Customer = {
      avatar: '',
      first_name: '',
      last_name: '',
      address: '',
      email: '',
      city: '',
      state: '',
      order_total: 0,
      gender: ''
  };
  newCustomer = true;
  customerForm: FormGroup;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private homeService: HomeService,
              private http_client: HttpClient) {
    try {
      this.route.queryParams.subscribe(params => {
        this.id = params['id'];
      });
    } catch (e) {console.log('no id param'); }
   }

  ngOnInit() {
    if (this.id !== '') {
      this.getCustomerInfo(this.id);
    }
    this.customerForm = new FormGroup({
      first_name: new FormControl('', {
        validators: Validators.required
      }),
      last_name: new FormControl('', {
        validators: Validators.required
      }),
      email: new FormControl('', {
        validators: Validators.required
      }),
      address: new FormControl('', {
        validators: Validators.required
      }),
      city: new FormControl('', {
        validators: Validators.required
      }),
      state: new FormControl('', {
        validators: Validators.required
      }),
      order_total: new FormControl('', {
        validators: Validators.required
      }),
      gender: new FormControl('', {
        validators: Validators.required
      })
    });
  }
  blobToFile(theBlob, fileName) {
    theBlob.lastModifiedDate = new Date();
    theBlob.name = fileName;
    return theBlob;
  }

  getCustomerInfo(id) {
    this.homeService.getCustomersById(id).subscribe(data => {
      this.customer = data[0];
      this.newCustomer = false;
      console.log(data);
      this.http_client.get('http://localhost:8000' + this.customer.avatar, { responseType: 'blob' })
                 .subscribe(result => {
                   console.log('test');
                   console.log(result);
                   this.selectedFile = new ImageSnippet(this.customer.avatar.substr(15), new File([result], this.customer.avatar.substr(15),
                   {type: 'image/png', lastModified: Date.now()}));
                   // this.selectedFile = this.blobToFile(result, this.customer.avatar.substr(15));
                   console.log(this.selectedFile);
                  });
      this.customerForm = new FormGroup({
        first_name: new FormControl(this.customer.first_name, {
          validators: Validators.required
        }),
        last_name: new FormControl(this.customer.last_name, {
          validators: Validators.required
        }),
        email: new FormControl(this.customer.email, {
          validators: [Validators.required, Validators.email]
        }),
        address: new FormControl(this.customer.address, {
          validators: Validators.required
        }),
        city: new FormControl(this.customer.city, {
          validators: Validators.required
        }),
        state: new FormControl(this.customer.state, {
          validators: Validators.required
        }),
        order_total: new FormControl(this.customer.order_total, {
          validators: [Validators.required, Validators.pattern('^[0-9]*$')]
        }),
        gender: new FormControl(this.customer.gender, {
          validators: Validators.required
        })
      });
    });
  }

  processFile(imageInput: any) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();
    console.log('test');
    reader.addEventListener('load', (event: any) => {
      this.selectedFile = new ImageSnippet(event.target.result, file);
    });
    reader.readAsDataURL(file);
  }

  addCustomer() {
    const first_name = this.customerForm.get('first_name').value;
    const last_name = this.customerForm.get('last_name').value;
    const email = this.customerForm.get('email').value;
    const address = this.customerForm.get('address').value;
    const city = this.customerForm.get('city').value;
    const state = this.customerForm.get('state').value;
    const gender = this.customerForm.get('gender').value;
    const order_total = +this.customerForm.get('order_total').value;
    console.log(this.selectedFile.file);
    this.homeService.addCustomers(this.selectedFile.file, first_name, last_name, address, email,
      city, state, order_total, gender).subscribe(data => {
      console.log(data);
      this.router.navigate(['home']);
    });
  }

  updateCustomer() {
    const first_name = this.customerForm.get('first_name').value;
    const last_name = this.customerForm.get('last_name').value;
    const email = this.customerForm.get('email').value;
    const address = this.customerForm.get('address').value;
    const city = this.customerForm.get('city').value;
    const state = this.customerForm.get('state').value;
    const gender = this.customerForm.get('gender').value;
    const order_total = +this.customerForm.get('order_total').value;
    console.log(email);
    this.homeService.editCustomers(this.id, this.selectedFile.file, first_name, last_name, address, email,
      city, state, order_total, gender).subscribe(data => {
      console.log(data);
      this.router.navigate(['home']);
    });
  }

}
