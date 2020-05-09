import { Component, OnInit, Input } from '@angular/core';
import { DataServiceService } from 'src/app/services/data-service.service';
import { GlobalDataSummary } from 'src/app/models/global-data';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  totalConfirmed=0;
  totalActive=0;
  totalDeaths=0;
  totalRecovered=0;
  loading=true;
  datatable=[];
  globalData: GlobalDataSummary[];
  chart={
    pieChart:"PieChart",
    columnChart: "ColumnChart",
    height: 500,
    options: {
      animation: {
        duration: 1500,
        easing: 'linear',
        startup: true
      },
      is3D: true

    }
  }
  
 

  initChart(caseType: String){

    this.datatable=[]
    this.globalData.forEach(cs=>{
      let value: number
      if(caseType=='c')
      {if(cs.confirmed>2000)
      {
        value=cs.confirmed
      }
      }
      if(caseType=='a')
      {
        if(cs.confirmed>2000)
      {
        value=cs.active
      }
      }
      if(caseType=='r')
      {if(cs.confirmed>2000)
      {
        value=cs.recovered
      }
      }
      if(caseType=='d')
      {if(cs.confirmed>2000)
      {
        value=cs.deaths
      }
      }
      this.datatable.push([
        cs.country, value
      ])
    });
    


  
  }
  constructor(private dataservice: DataServiceService) { }

  ngOnInit(): void {
    

    this.dataservice.getGlobalData()
    .subscribe({
      next: (result)=>{
        console.log(result)
        this.globalData=result
        result.forEach(cs=>{
          if (!Number.isNaN(cs.confirmed))
          {
          this.totalActive+=cs.active;
          this.totalConfirmed+=cs.confirmed;
          this.totalDeaths+=cs.deaths;
          this.totalRecovered+=cs.recovered;
        }
        })
        this.initChart('c');
        this.loading=false
      }
      
    })
    
  }
updateChart(input){
  console.log(input.value)
  this.initChart(input.value)

}
  
}
