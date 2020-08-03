<template>
    <div class="app-container">
        <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload" style="padding-bottom: 32px"/>
<!--        <el-table :data="tableData" border highlight-current-row style="width: 100%;margin-top:20px;">-->
<!--            <el-table-column v-for="item of tableHeader" :key="item" :prop="item" :label="item" />-->
<!--        </el-table>-->
            <el-table :key="tableKey"
                      v-loading="listLoading"
                      :data="ads"
                      border
                      fit
                      highlight-current-row
                      style="width: 100%;">
                <el-table-column label="" prop="id" sortable="custom" align="center" width="80">
                    <template slot-scope="{row , $index}">
                        <span>{{ $index + 1 }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="Thumb" align="center" width="80">
                    <template slot-scope="{row}">
                        <el-image :src="row.thumb" style="width: 40px ; height: 40px"
                                  :preview-src-list="row.images"></el-image>
                    </template>
                </el-table-column>
                <el-table-column label="Product" min-width="350">
                    <template slot-scope="{row}">
                        <a target="_blank" :href="row.url">{{ row.title }}</a>
                    </template>
                </el-table-column>
                <el-table-column label="Actions" align="center" width="350" class-name="small-padding fixed-width">
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
        components: { UploadExcelComponent },
        data() {
            return {
                listLoading: false,
                tableKey: 0,
                tableData: [],
                tableHeader: [],
                ads:[]
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
            handleSuccess({ results, header }) {
                this.tableData = results
                this.tableHeader = header
                this.adsFromXlsx(results)
            },

            adsFromXlsx(results){
                let tempAds = []
                results.forEach(element => {
                    let item = {
                        adType : 1,
                        timeReload:10,
                        title: element["Title"],
                        thumb: element["Image Src"],
                        images: [element["Variant Image"]],
                        sku: element["Variant SKU"],
                        description:"",
                        status:""
                    }
                    tempAds.push(item)

                });
                this.ads = tempAds;


            }
        }
    }
</script>
