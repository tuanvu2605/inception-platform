<template>
  <div class="app-container">


    <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" style="padding-bottom: 32px"/>
    <el-row :gutter="20" class="form-action">
      <el-col :span="20">
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item>
            <el-button type="primary" icon="el-icon-check" @click="checkingItems" style="color: white">
              Checking
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <!--        <el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;">-->
    <!--            <el-table-column v-for="item of tableHeader" :key="item" :prop="item" :label="item" />-->
    <!--        </el-table>-->
    <el-table :key="tableKey"
              v-loading="listLoading"
              :data="isChecking ? errorItems : orders"
              border
              fit
              highlight-current-row
              style="width: 100%;">
      <el-table-column label="" prop="id" sortable="custom" align="center" width="80">
        <template slot-scope="{row , $index}">
          <span>{{ $index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column label="OrderId" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.orderId }}</span>
        </template>

      </el-table-column>
      <el-table-column label="DesignURL" min-width="120">
        <template slot-scope="{row}">
          <a target="_blank" :href="row.designURL">{{ row.designURL }}</a>
        </template>
      </el-table-column>
      <el-table-column label="Design Review" align="center" width="120">
        <template slot-scope="{row}">
          <el-image :src="row.designURL" style="width: 60px ; height: 60px"
                    :preview-src-list="[row.designURL]"></el-image>
        </template>
      </el-table-column>
      <el-table-column label="Quantity" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.quantity }}</span>
        </template>

      </el-table-column>
      <el-table-column label="ProductName" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.productName }}</span>
        </template>

      </el-table-column>
      <el-table-column label="ProductId" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.productId }}</span>
        </template>

      </el-table-column>
      <el-table-column label="Status" align="center" width="80" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="edit(row)" style="color: white">
            Edit
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import UploadExcelComponent from '../../components/UploadExcel'

export default {
  name: 'UploadExcel',
  components: {UploadExcelComponent},
  data() {
    return {
      isChecking: false,
      listLoading: false,
      tableKey: 0,
      tableData: [],
      tableHeader: [],
      orders: [],
      errorItems: []
    }
  },
  methods: {
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1

      if (isLt1M) {
        return true
      }

      this.$message({
        message: 'Please do not upload files larger than 1m in size.',
        type: 'warning'
      })
      return false
    },
    handleSuccess({results, header}) {
      this.tableData = results
      this.tableHeader = header
      this.adsFromXlsx(results)
    },

    checkingItems() {
      this.isChecking = true
      this.errorItems = []
      this.orders.forEach(item => {
        this.testImage(item.designURL).then(()=>{}).catch(
            ()=>{
              item.isDesignError = true
              this.errorItems.push(item)
        })
      })
    },

    testImage(url, timeoutT) {
      return new Promise(function (resolve, reject) {
        let timeout = timeoutT || 5000;
        let timer, img = new Image();
        img.onerror = img.onabort = function () {
          clearTimeout(timer);
          reject("error");

        };
        img.onload = function () {
          clearTimeout(timer);
          resolve("success");
        };
        timer = setTimeout(function () {
          // reset .src to invalid URL so it stops previous
          // loading, but doesn't trigger new load

          reject("timeout");
        }, timeout);
        img.src = url;
      });
    },

    adsFromXlsx(results) {
      this.isChecking = false
      let tempOrders = []
      results.forEach(element => {
        let item = {

          orderId: element["OrderId"],
          designURL: element["DesignURL"],
          quantity: element["Quantity"],
          productName: element["ProductName"],
          productId: element["ProductId"],
          isDesignError: false

        }
        tempOrders.push(item)

      });
      this.orders = tempOrders;



    }
  }
}
</script>
