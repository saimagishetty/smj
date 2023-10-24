import { Component } from '@angular/core';
import { DataService } from '../data/data.service';

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
  newObj = [{
      "date": "",
      "amount": "",
      "payment_info": ""
    }
  ]
  formData = [{
      name: "Card",
      log: "credit_card",
      rows: [JSON.parse(JSON.stringify(this.newObj))]
    },{
      name: "UPI/IMPS",
      log: "receipt_long",
      rows: [JSON.parse(JSON.stringify(this.newObj))]
    },{
      name: "RTGS/NEFT",
      log: "paid",
      rows: [JSON.parse(JSON.stringify(this.newObj))]
    },{
      name: "Cheque",
      log: "payments",
      rows: [JSON.parse(JSON.stringify(this.newObj))]
    },]
  onKeyDown(event: KeyboardEvent, index: number) {
    if (event.shiftKey && event.key === 'Enter') {
      this.formData[index].rows.push(JSON.parse(JSON.stringify(this.newObj)))
    }
  }
  add_new(index: any) {
    this.formData[index].rows.push(JSON.parse(JSON.stringify(this.newObj)))
  }
  delete_arry(i: any, index: any) {
    this.formData[index].rows.splice(i, i)
  }
  formatPaymentData(mode: number, dataArray: any[]): any {
    return {
      mode,
      options: dataArray.map(item => {
        return {
          date: item.date,
          amount: item.amount,
          payment_info: item.payment_info
        };
      })
    };
  }
  submit() {
    const url = 'https://sipserver.1ounce.in/shop/task/';
    const paymentData_copy = this.formData.map((a, index) => {
      return {
        mode: index,
        options: a.rows
      }
    });
    const paymentData = [
      this.formatPaymentData(1, this.formData[1].rows),
      this.formatPaymentData(2, this.formData[0].rows),
      this.formatPaymentData(3, this.formData[2].rows),
      this.formatPaymentData(4, this.formData[3].rows)
    ];
    const data = {
      payment_data: JSON.stringify(paymentData)
    };
    this.dataService.postData(url, data).subscribe(
      response => {
        console.log('API Response:', response);
        this.showMessage = response.message
      },
      error => {
        console.error('Error:', error);
        this.showMessage = "something went wrong"
      }
    );
  }
}
