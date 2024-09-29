import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridReadyEvent, IServerSideDatasource, IServerSideGetRowsRequest, RowModelType } from 'ag-grid-community';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import 'ag-grid-enterprise';
import { IOlympicDataWithId } from '../../models/interfaces';



@Component({
  selector: "app-feature-3",
  standalone: true,
  imports: [AgGridAngular],
  template: `<ag-grid-angular
    style="width: 100%; height: 100%;"
    [columnDefs]="columnDefs"
    [defaultColDef]="defaultColDef"
    [rowModelType]="rowModelType"
    [blockLoadDebounceMillis]="blockLoadDebounceMillis"
    [rowData]="rowData"
    [class]="themeClass"
    (gridReady)="onGridReady($event)"
  /> `,
})
export class Feature2Component {

  // properties
  public columnDefs: ColDef[] = [
    { field: "id", maxWidth: 80 },
    { field: "athlete", minWidth: 220 },
    { field: "country", minWidth: 200 },
    { field: "year" },
    { field: "sport", minWidth: 200 },
    { field: "gold" },
    { field: "silver" },
    { field: "bronze" },
  ];



  // 
  public defaultColDef: ColDef = {
    flex: 1,
    minWidth: 100,
    sortable: false,
  };

  public rowModelType: RowModelType = "serverSide";

  public blockLoadDebounceMillis = 1000;

  public rowData!: IOlympicDataWithId[];

  public themeClass: string = "ag-theme-quartz";





  // constructor
  constructor(private http: HttpClient) { }




  // methods
  onGridReady(params: GridReadyEvent<IOlympicDataWithId>) {
    this.http
      .get<IOlympicDataWithId[]>("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .subscribe((data) => {
        // adding row id to data
        var idSequence = 0;
        data.forEach(function (item: any) {
          item.id = idSequence++;
        });
        // setup the fake server with entire dataset
        var fakeServer = createFakeServer(data);
        // create datasource with a reference to the fake server
        var datasource = createServerSideDatasource(fakeServer);
        // register the datasource with the grid
        params.api!.setGridOption("serverSideDatasource", datasource);
      });
  }
}




// funtions
function createServerSideDatasource(server: any): IServerSideDatasource {
  return {
    getRows: (params) => {
      console.log("[Datasource] - rows requested by grid: ", params.request);
      // get data for request from our fake server
      var response = server.getData(params.request);
      // simulating real server call with a 500ms delay
      setTimeout(() => {
        if (response.success) {
          // supply rows for requested block to grid
          params.success({
            rowData: response.rows,
            rowCount: response.lastRow,
          });
        } else {
          params.fail();
        }
      }, 100);
    },
  };
}

function createFakeServer(allData: any[]) {
  return {
    getData: (request: IServerSideGetRowsRequest) => {
      // take a slice of the total rows for requested block
      var rowsForBlock = allData.slice(request.startRow, request.endRow);
      // when row count is known and 'blockLoadDebounceMillis' is set it is possible to
      // quickly skip over blocks while scrolling
      var lastRow = allData.length;
      return {
        success: true,
        rows: rowsForBlock,
        lastRow: lastRow,
      };
    },
  };
}
