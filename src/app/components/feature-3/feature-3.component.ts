import { Component } from '@angular/core';
import { ColDef, GetRowIdParams, GridApi, GridReadyEvent, IServerSideDatasource, IServerSideGetRowsParams, IsServerSideGroupOpenByDefaultParams, RowModelType, RowSelectionOptions } from 'ag-grid-community';
import { IOlympicData } from '../../models/interfaces';
import { HttpClient } from '@angular/common/http';
import { AgGridAngular } from 'ag-grid-angular';

@Component({
  selector: 'app-feature-3',
  standalone: true,
  imports: [AgGridAngular],
  template: `<ag-grid-angular
    style="width: 100%; height: 100%;"
    [columnDefs]="columnDefs"
    [defaultColDef]="defaultColDef"
    [autoGroupColumnDef]="autoGroupColumnDef"
    [rowModelType]="rowModelType"
    [rowData]="rowData"
    [class]="themeClass"
    (gridReady)="onGridReady($event)"
  /> `,
})
export class Feature3Component {

  // properties
  public columnDefs: ColDef[] = [
    {
      colId: "country",
      valueGetter: "country.name",
      rowGroup: true,
      hide: true,
    },
    { field: "gold", aggFunc: "sum", enableValue: true },
    { field: "silver", aggFunc: "sum", enableValue: true },
    { field: "bronze", aggFunc: "sum", enableValue: true },
  ];

  public defaultColDef: ColDef = {
    flex: 1,
    minWidth: 150,
  };

  public autoGroupColumnDef: ColDef = {
    flex: 1,
    minWidth: 280,
  };

  public rowModelType: RowModelType = "serverSide";

  public rowData!: IOlympicData[];

  public themeClass: string = "ag-theme-quartz";





  // constructor
  constructor(private http: HttpClient) {}





  // methods
  onGridReady(params: GridReadyEvent<IOlympicData>) {
    this.http.get<IOlympicData[]>("https://www.ag-grid.com/example-assets/olympic-winners.json")
    .subscribe((data) => {
      var fakeServer = new FakeServer(data);
      var datasource = getServerSideDatasource(fakeServer);
      params.api!.setGridOption("serverSideDatasource", datasource);
    })
  }
}





// functions
function getServerSideDatasource(server: any): IServerSideDatasource {
  return {
    getRows: (params) => {
      console.log("[Datasource] - rows requested by grid: ", params.request);
      var response = server.getData(params.request);
      var resultsWithComplexObjects = response.rows.map(function (row: any) {
        row.country = {
          name: row.country,
          code: row.country.substring(0, 3).toUpperCase(),
        };
        return row;
      });
      
      setTimeout(() => {
        if (response.success) {
          // call the success callback
          params.success({
            rowData: resultsWithComplexObjects,
            rowCount: response.lastRow,
          });
        } else {
          // inform the grid request failed
          params.fail();
        }
      }, 200);
    }
  };
}









