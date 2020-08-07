<template>
    <el-dialog :visible.sync="IsShowModal" v-bind="$attrs">
        <el-form ref="modalForm" :rules="rules" :model="temp" label-position="left" label-width="120px"
                 style="width: 400px; margin-left:50px;">
            <el-form-item label="Shopify Id" prop="shopifyProductId">
                <el-input v-model="temp.shopifyProductId"
                          placeholder="Please input" style="width: 500px"/>
            </el-form-item>
            <el-form-item label="Title" prop="title">
                <el-input v-model="temp.title"
                          placeholder="Please input" style="width: 500px"/>
            </el-form-item>
            <el-form-item label="Type" prop="adType">
                <el-select v-model="temp.adType" class="filter-item" placeholder="Please select" style="width: 120px">
                    <el-option v-for="item in adTypes" :key="item.id" :label="item.title" :value="item.id"/>
                </el-select>
            </el-form-item>
            <el-form-item label="Description" prop="description">
                <el-input v-model="temp.description"
                          placeholder="Please input" type="textarea" :rows="2" style="width: 500px"/>
            </el-form-item>

            <el-form-item label="Url" prop="url">
                <el-input v-model="temp.url"
                          placeholder="Please input" style="width: 500px"/>
            </el-form-item>
            <el-form-item label="Thumb" prop="thumb">
                <el-input v-model="temp.thumb" placeholder="Please input" style="width: 500px" type="url"/>
            </el-form-item>
            <el-form-item label="Images" prop="images">
                <el-form-item v-for="(img,index) in temp.images" :key="index" :prop="'img' + index">
                    <el-input
                            v-model="temp.images[index]"
                            :placeholder=" 'Image #' + (index+ 1)"
                            style="width: 500px; margin-bottom: 24px" type="url">
                        <el-button slot="append" type="danger" @click="removeImageUrl(temp.images,index)"
                                   icon="el-icon-delete"></el-button>
                    </el-input>
                </el-form-item>
                <el-button type="primary" @click="addNewImg(temp.images)" style="color: white ">New</el-button>
            </el-form-item>
            <el-form-item label="Status" prop="status">
                <el-select v-model="temp.status" class="filter-item" placeholder="Please select" style="width: 120px">
                    <el-option v-for="item in statusOptions" :key="item" :label="item" :value="item"/>
                </el-select>
            </el-form-item>
            <el-form-item label="Locations" prop="location">
                <el-drag-select v-model="temp.location" multiple placeholder="请选择" style="width:500px;">
                    <el-option v-for="item in countries" :key="item.code" :label="item.name" :value="item.code"/>
                </el-drag-select>
            </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="cancel">
                Cancel
            </el-button>
            <el-button type="primary" @click="confirm('modalForm')">
                Confirm
            </el-button>
        </div>
    </el-dialog>

</template>

<script>
    import ElDragSelect from '../../components/DragSelect' // base on element-ui
    import {statusOptions} from "../../const";
    import {validURL} from "../../const";
    import {mapGetters} from "vuex";

    export default {
        components: {ElDragSelect},
        name: 'ModalCreate',


        data () {
            let checkImagesFormData =  (rule, value, callback) => {
                let check = true
                value.forEach(item => {
                    if (!validURL(item)){
                        check = false
                    }

                })
                if (value.length == 0 || !check) {
                    console.log('Please checking images list')
                    callback(new Error('Please checking images list'));
                } else {
                    callback();
                }

            }
            return {
            finds: [],
            adTypes: [{title: 'Interstitial', id: 1}, {title: 'Banner', id: 2}, {title: 'Native', id: 3}],
            statusOptions: statusOptions,
            dialogStatus: '',


            rules: {
                adType: [
                    {required: true, message: 'Please select adType', trigger: 'change'}
                ],
                description: [{required: true, message: 'Description is required', trigger: 'blur'}],
                shopifyProductId: [{required: true, message: 'Shopify id is required', trigger: 'blur'}],
                title: [{required: true, message: 'Title is required', trigger: 'blur'}],
                url: [
                    {type: 'url', required: true, message: 'Product url is required', trigger: 'blur'},
                ],
                thumb: [
                    {type: 'url', required: true, message: 'Thumb url is required', trigger: 'blur'},
                ],
                images: [{validator:checkImagesFormData,required: true}],
                location: [{required: true}],
                status: [{required: true}],
                timeReload: [{required: true, message: 'Time reload required', trigger: 'blur'}]

            },
            value: [],
        }},

        props: {
            temp: {},
            isVisible: {
                type: Boolean,
                require: true
            }
        },

        computed: {
            ...mapGetters([
                'countries'
            ]),
            IsShowModal: {
                get: function () {
                    return this.isVisible
                },
                set: function () {
                    this.$emit('modal-cancel');
                }
            }
        },


        methods: {
            addNewImg(arr) {
                arr.push('');

            },
            removeImageUrl(arr, index) {
                arr.splice(index, 1);
            },
            confirm(formRef) {

                this.$refs[formRef].validate((valid) => {
                    if (valid) {
                        this.$emit('modal-confirm', 'valid');
                    } else {
                        this.$emit('modal-confirm', 'invalid');
                    }
                });
            },
            cancel() {
                this.$emit('modal-cancel');
            }
        },
        created() {

        }
    }

</script>

<style>

</style>
