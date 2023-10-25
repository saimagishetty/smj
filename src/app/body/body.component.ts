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
  tableHeads = ["Amount", "Date", "Bank", "Card details", ""]
  formData = [
    new Template('Card', 'credit_card',[new SampleData()]),
    new Template('UPI/IMPS', 'receipt_long',[new SampleData()]),
    new Template('RTGS/NEFT', 'paid', [new SampleData()]),
    new Template('Cheque', 'payments', [new SampleData()])
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
    const url = 'https://sipserver.1ounce.in/shop/task/';
    const paymentData = this.formData.map((template, index) => {
      const mode = index + 1;
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
        this.showMessage = response.message;
      },
      error => {
        console.error('Error:', error);
        this.showMessage = "Something went wrong";
      }
    );
  }
}
