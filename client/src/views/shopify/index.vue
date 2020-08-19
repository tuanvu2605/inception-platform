<template>
    <v-app>
    <div>
        <el-row :gutter="20" class="form-action" style="padding: 32px">
            <el-col :span="6">
                <el-button-group >
                    <el-button type="primary" icon="el-icon-arrow-left" style="color: white" @click="prevPage" :disabled="links.previous === undefined">Previous Page</el-button>
                    <el-button type="primary" style="color: white" @click="nextPage"  :disabled="links.next === undefined">Next Page<i class="el-icon-arrow-right"></i></el-button>
                </el-button-group>
            </el-col>
            <el-col :span="18">
                <el-form :inline="true" :model="filter" class="demo-form-inline">
                    <el-form-item label="">
                        <el-input v-model="filter.title" placeholder="Enter product id" style="width: 450px"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search"  @click="filterItems" style="color: white">Search</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>


        <el-table :key="tableKey"
                  v-loading="listLoading"
                  :data="products"
                  border
                  fit
                  highlight-current-row
                  style="width: 100%;">
            <el-table-column
                    type="selection"
                    width="55" align="center">
            </el-table-column>
            <el-table-column label="Thumb" align="center" width="120">
                <template slot-scope="{row}">
                    <el-image :src="row.image.src" style="width: 90px ; height: 90px"
                              :preview-src-list="row.images.flatMap(x => x.src)"></el-image>
                </template>
            </el-table-column>
            <el-table-column label="ID" prop="id" align="center" width="150">
                <template slot-scope="{row}">
                    <span>{{row.id}}</span>
                </template>
            </el-table-column>

            <el-table-column label="Title" min-width="350">
                <template slot-scope="{row}">
                    <el-link target="_blank" :href=" 'https://www.awesome-shop.co/products/' + row.handle " type="primary" style="text-decoration-line: underline;" > <i class="el-icon-link"></i>{{ row.title }}</el-link>
                </template>
            </el-table-column>
            <el-table-column label="Description" min-width="350">
                <template slot-scope="{row}">
                    <span v-html="row.body_html"></span>
                </template>
            </el-table-column>
            <el-table-column label="Vendor" min-width="350">
                <template slot-scope="{row}">
                    <span>{{ row.vendor }}</span>
                </template>
            </el-table-column>

            <el-table-column label="Type" min-width="150">
                <template slot-scope="{row}">
                    <span>{{ row.product_type }}</span>
                </template>
            </el-table-column>

            <el-table-column label="Date" width="250px" align="center">
                <template slot-scope="{row}">
                    <span>{{ row.published_at }}</span>
                </template>
            </el-table-column>

            <el-table-column label="Tags" prop="id" width="100" align="center">
                <template slot-scope="{row}">
                    <span>{{row.tags}}</span>
                </template>
            </el-table-column>

            <el-table-column label="Actions" align="center" width="350" class-name="small-padding fixed-width">
                <template slot-scope="{row}">
                    <el-button type="primary" size="mini" @click="createAds(row)"  icon="el-icon-document-add" style="color: white" :disabled="shopifyIds.includes(row.id.toString())">
                        Advertisement
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>

    <el-modal-create :temp="selectedItem" :isVisible="dialogFormVisible" v-on:modal-cancel="modalCancel"
                     v-on:modal-confirm="modalCreate">

    </el-modal-create>
    </v-app>

</template>


<script>
    import axios from "axios";
    import {getShopifyProductsURL, urlPath, getShopifyProductByIdURL} from "../../const";
    import ElModalCreate from '../../components/ModalCreate'
    export default {
        components: {ElModalCreate},
        data: () => ({
            products: [],
            shopifyIds : [],
            listLoading: false,
            tableKey: 0,
            links: {},
            filter: {
                title: '',
            },
            selectedItem:{},
            dialogFormVisible: false,
        }),
        methods: {
            nextPage() {
                this.listLoading = true;
                if (this.links.next != null) {
                    axios
                        .post(urlPath("/shopify/products"), {
                            shopifyURL: getShopifyProductsURL('50',this.links.next.page_info)
                        })
                        .then(response => {
                            this.products = response.data.products;
                            if (response.data.links){
                                this.links = response.data.links;
                            }
                            this.listLoading = false;
                        })
                        .catch(error => {
                            this.listLoading = false;
                            console.log(error)
                        });
                }
            },
            prevPage(){
                //previous
                this.listLoading = true;
                if (this.links.previous != null) {
                    axios
                        .post(urlPath("/shopify/products"), {
                            shopifyURL: getShopifyProductsURL('50',this.links.previous.page_info)
                        })
                        .then(response => {
                            this.products = response.data.products;
                            if (response.data.links){
                                this.links = response.data.links;
                            }

                            this.listLoading = false;
                        })
                        .catch(error => {
                            this.listLoading = false;
                            console.log(error)
                        });
                }
            },
            filterItems(){
                let num = parseInt(this.filter.title)
                if ( num.toString().length == 13) {
                    axios
                        .post(urlPath("/shopify/product"), {
                            shopifyURL: getShopifyProductByIdURL(num.toString())
                        })
                        .then(response => {
                            if (response.data.product != null) {
                                this.products = [response.data.product];
                                this.links = {};
                                this.listLoading = false;
                            } else {

                                this.$notify({
                                    title: 'Not found',
                                    message: 'Product not found',
                                    type: 'error',
                                    duration: 2000
                                })
                            }
                        })
                        .catch(error => {
                            this.listLoading = false;
                            console.log(error)
                        });
                } else {
                    this.$message({
                        message: 'Product id invalid',
                        type: 'error'
                    });
                }

            },
            createAds(item){
                let tempItem  = {
                    "adType": 1,
                    "timeReload": 10,
                    "title": item.title,
                    "url": 'https://www.awesome-shop.co/products/' + item.handle,
                    "thumb": item.image.src,
                    "shopifyProductId":item.id,
                    "sku":item.variants[0].sku,
                    "images": item.images.flatMap(x => x.src),
                    "location": [
                    ],
                    "description":item.body_html,
                    "status": "published"
                }

                this.selectedItem = tempItem
                this.dialogFormVisible = true

            },
            modalCancel() {
                this.selectedItem = {}
                this.dialogFormVisible = false;
            },
            modalCreate(isValid){
                console.log(isValid)
                if (isValid === 'valid') {
                    axios
                        .post(urlPath("/ad/add"), {
                            ad: this.selectedItem
                        })
                        .then(response => {
                            if (response.data.type == 'success'){
                                this.dialogFormVisible = false;
                            }
                            this.$notify({
                                title: 'Notification ✵',
                                message: response.data.message,
                                type: response.data.type,
                                duration: 5000
                            })
                        });

                }else if (isValid === 'invalid'){
                    this.$message({
                        message: 'Form is invalid',
                        type: 'error'
                    });
                }

            }

        },
        created() {

            this.listLoading = true;
            axios
                .get(urlPath("/ad/shopifyIds"))
                .then(response => {
                    this.listLoading = false;
                    let list = response.data.flatMap(item=>item.shopifyProductId)
                    if (list.length > 0 ) {
                        this.shopifyIds = list
                        console.log(this.shopifyIds)
                    }
                })
                .catch(error => {
                    this.listLoading = false;
                    console.log(error)

                });
            axios
                .post(urlPath("/shopify/products"), {
                    shopifyURL: getShopifyProductsURL('50')
                })
                .then(response => {
                    this.listLoading = false;
                    this.products = response.data.products;
                    if (response.data.links){
                        this.links = response.data.links;
                    }

                })
                .catch(error => {
                    this.listLoading = false;
                    console.log(error)

                });





        }

    }
</script>
