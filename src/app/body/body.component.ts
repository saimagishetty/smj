import { Component } from '@angular/core';
import { DataService } from '../data/data.service';
import { Template } from '../model/template';
import { SampleData } from '../model/sampleData';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.scss']
})
export class BodyComponent {
  constructor(
    private dataService: DataService
  ) { }
  showMessage: any
  loading=false
  tableHeads = ["Amount", "Date", "Bank", "Card details", ""]
  formData = [
    new Template('Card', 'credit_card',2,[new SampleData()]),
    new Template('UPI/IMPS', 'receipt_long',1,[new SampleData()]),
    new Template('RTGS/NEFT', 'paid', 3,[new SampleData()]),
    new Template('Cheque', 'payments',4, [new SampleData()])
  ];
  handleEvent(index: number, event?: KeyboardEvent) {
    if (event?.shiftKey && event?.key === 'Enter') {
      this.formData[index].rows.push(new SampleData());
    } else if (!event) {
      this.formData[index].rows.push(new SampleData());
    }
  }
  delete_arry(i: any, index: any) {
    this.formData[index].rows.splice(i, 1)
  }
  submit() {
    this.loading=true
    const url = 'https://sipserver.1ounce.in/shop/task/';
    const paymentData = this.formData.map((template) => {
      const mode = template.mode;
      const options = template.rows.map((row:any) => ({
        date: row.date,
        amount: row.amount,
        payment_info: row.payment_info
      }));
      return { mode, options };
    });
    const data = {
      payment_data: JSON.stringify(paymentData)
    };
    this.dataService.postData(url, data).subscribe(
      response => {
        console.log('API Response:', response);
        this.loading=false
        this.showMessage = response.message;
      },
      error => {
        console.error('Error:', error);
        this.loading=false
        this.showMessage = "Something went wrong";
      }
    );
  }
}
