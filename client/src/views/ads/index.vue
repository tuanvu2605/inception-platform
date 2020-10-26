<template>
    <v-app>
        <el-row :gutter="20" class="form-action">
            <el-col :span="20">
                <el-form :inline="true" :model="filter" class="demo-form-inline">
                    <el-form-item label="Product Name">
                        <el-input v-model="filter.title" placeholder="Enter product name"></el-input>
                    </el-form-item>
                    <el-form-item label="Status">
                        <el-select v-model="filter.status" placeholder="Status by">
                            <el-option v-for="item in statusOpts" :key="item" :label="item" :value="item"/>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="Locations">
                        <el-drag-select v-model="filter.location" multiple placeholder="请选择" style="width:350px;">
                            <el-option v-for="item in countries" :key="item.code"
                                       :label="item.name" :value="item.code"/>
                        </el-drag-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" @click="filterItems" style="color: white">
                            Search
                        </el-button>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="4">
                <div class="button-container">
                    <el-button type="primary" icon="el-icon-plus" round @click="handleCreate" style="color: white">
                        Advertisement
                    </el-button>
                </div>
            </el-col>
        </el-row>


        <div class="table-container">
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
                <el-table-column label="Thumb" align="center" width="120">
                    <template slot-scope="{row}">
                        <el-image :src="row.thumb" style="width: 80px ; height: 80px"
                                  :preview-src-list="row.images"></el-image>
                    </template>
                </el-table-column>
                <el-table-column label="Product" min-width="350">
                    <template slot-scope="{row}">
                        <a target="_blank" :href="row.url">{{ row.title }}</a>
                    </template>
                </el-table-column>
                <el-table-column label="Description" min-width="350" style="max-height: 300px">
                    <template slot-scope="{row}">
                        <span v-html="row.description"></span>
                    </template>
                </el-table-column>
                <el-table-column label="Location" prop="id" width="250" align="center">
                    <template slot-scope="{row}">
                        <el-tag
                                :key="tag"
                                v-for="tag in row.location"
                                :disable-transitions="false"
                        >
                            <b>{{tag}}</b>
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="Status" class-name="status-col" align="center" width="150">
                    <template slot-scope="{row}">
                        <el-tag :type="row.status == 'published' ? 'success' : 'danger'">
                            {{ row.status.toUpperCase() }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="Actions" align="center" width="350" class-name="small-padding fixed-width">
                    <template slot-scope="{row}">
                        <el-button type="primary" size="mini" @click="edit(row)" style="color: white"><i
                                class="el-icon-edit-outline"></i>

                            Edit
                        </el-button>

                        <el-button size="mini" type="danger"
                                   @click="removeItem(row)" style="color: white"><i class="el-icon-delete"></i>
                            Remove
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                    background
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page.sync="options.page"
                    :page-sizes="[10, 20, 50, 100]"
                    :page-size="options.limit"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total"
                    class="table-paging"
            >
            </el-pagination>
        </div>

        <el-modal-create :temp="tempAd" :isVisible="dialogFormVisible" v-on:modal-cancel="modalCancel"
                         v-on:modal-confirm="modalConfirm">

        </el-modal-create>


    </v-app>
</template>

<style>
    .el-tag + .el-tag {
        margin-left: 10px;
    }

    .button-container {

        flex-direction: row;

    }

    .form-action {
        padding: 32px 16px 0px 16px;
    }

    .table-container {
        margin: 16px;
    }

    body {
        font-family: Arial, Helvetica, sans-serif;
    }

    .table-paging {
        padding: 32px 16px 0px 16px;
    }


    .input-with-select .el-input-group__prepend {
        background-color: #fff;


    }


</style>

<script>
    import axios from "axios";
    import { mapGetters } from 'vuex'
    import ElModalCreate from '../../components/ModalCreate'
    import {item, statusOptions, isEmpty, urlPath} from "../../const";
    import ElDragSelect from '../../components/DragSelect' // base on element-ui


    export default {

        components: {ElModalCreate, ElDragSelect},
        computed: {
            ...mapGetters([
                'countries'

            ])
        },
        data: () => ({
            statusOpts: statusOptions,
            dialogStatus: '',
            radio: 3,
            listLoading: false,
            tableKey: 0,
            ads: [],
            isShowImgModal: false,
            modal: undefined,
            inputVisible: false,
            dialogFormVisible: false,
            tempAd: Object,
            total: 0,
            filter: {
                title: '',
                status: '',
                location: []
            },
            options: {
                page: 1,
                limit: 20,
                importance: undefined,
                title: undefined,
                type: undefined,
                sort: '+id'
            },
        }),
        methods: {
            filterItems() {
                this.listLoading = true;
                let _filter = JSON.parse(JSON.stringify(this.filter));
                if (!isEmpty(_filter.title)) {
                    _filter.title = {"$regex": _filter.title, "$options": "i"}
                }
                if (_filter.location.length > 0) {
                    _filter.location = {$all: _filter.location}
                }


                axios
                    .post(urlPath("/ad/listing"), {
                        options: this.options,
                        filter: _filter

                    }).then(response => {
                    this.listLoading = false;
                    this.ads = response.data.docs;
                    this.total = response.data.totalDocs;
                })
                    .catch(error => {
                        this.listLoading = false;
                        console.log(error)
                    });
            },
            handleCreate() {
                this.tempAd = item
                this.dialogStatus = 'create'
                this.dialogFormVisible = true

            },
            edit(item) {
                this.dialogStatus = 'edit'
                this.tempAd = JSON.parse(JSON.stringify(item));
                this.dialogFormVisible = true
            },
            updateAd(item) {
                axios
                    .post(urlPath("/ad/update"), {
                        ad: item
                    })
                    .then(response => {
                        this.$message({
                            message: response.data.message,
                            type: response.data.type
                        });
                        this.fetchData();
                    });
            },
            createAd(item) {
                axios
                    .post(urlPath("/ad/add"), {
                        ad: item
                    })
                    .then(response => {
                        this.$message({
                            message: response.data.message,
                            type: response.data.type
                        });
                        this.fetchData();
                    });

            },
            handleSizeChange(val) {
                this.options.limit = val;
                this.fetchData();
            },
            handleCurrentChange(val) {
                this.options.page = val;

                this.fetchData();
            },
            fetchDataWithOption() {

                this.listLoading = true;
                axios
                    .post(urlPath("/ad/listing"), {
                        options: this.options

                    }).then(response => {
                    this.listLoading = false;
                    this.ads = response.data.docs;
                    this.total = response.data.totalDocs;
                })
                    .catch(error => {
                        this.listLoading = false;
                        console.log(error)
                    });
            },

            fetchData() {

                this.fetchDataWithOption();
            },
            modalConfirm(isValid) {
                if (isValid === 'valid') {
                    let item = JSON.parse(JSON.stringify(this.tempAd))
                    switch (this.dialogStatus) {
                        case "create":
                            this.createAd(item);
                            break;
                        case "edit":
                            this.updateAd(item)
                            break;
                        default:
                            console.log('confirm not handle');
                    }
                    this.dialogFormVisible = false;
                } else if (isValid === 'invalid') {
                    this.$message({
                        message: 'Form is invalid',
                        type: 'error'
                    });
                }


            }, modalCancel() {
                this.dialogFormVisible = false;
            },

            showMess() {
                this.tempAd = {}
                this.dialogFormVisible = false;
                this.$message({
                    message: this.temp.title,
                    type: 'success'
                })
            },
            removeItem(item) {
                let mess = 'This will permanently delete the* ' + item.title + ' * Continue?'
                this.$confirm(mess, 'Warning', {
                    confirmButtonText: 'OK',
                    cancelButtonText: 'Cancel',
                    type: 'warning'
                }).then(() => {
                    axios
                        .post(urlPath("/ad/remove"), {
                            itemId: item._id
                        })
                        .then(response => {
                            this.$message({
                                message: response.data.message,
                                type: response.data.type
                            });
                            this.fetchData();
                        });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: 'Delete canceled'
                    });
                });

            }
        },
        created() {
            
            axios
                .post(urlPath("/ad/listing"), {
                    options: this.options
                })
                .then(response => {
                    console.log('fuck', response.data);
                    this.ads = response.data.docs;
                    this.total = response.data.totalDocs;
                })
                .catch(error => console.log(error));



        }


    };
</script>
