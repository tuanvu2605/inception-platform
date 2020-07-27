<template>
    <el-dialog :visible.sync="IsShowModal" v-bind="$attrs">
        <el-form ref="modalForm" :rules="rules" :model="temp" label-position="left" label-width="120px"
                 style="width: 400px; margin-left:50px;">

            <el-form-item label="Title" prop="title">
                <el-input v-model="temp.title"
                          placeholder="Please input" style="width: 500px"/>
            </el-form-item>
            <el-form-item label="_Type" prop="adType">
                <el-select v-model="temp.adType" class="filter-item" placeholder="Please select" style="width: 120px">
                    <el-option v-for="item in adTypes" :key="item.id" :label="item.title" :value="item.id"/>
                </el-select>

            </el-form-item>
            <el-form-item label="Url" prop="url">
                <el-input v-model="temp.url"
                          placeholder="Please input" style="width: 500px"/>
            </el-form-item>
            <el-form-item label="Thumb" prop="thumb">
                <el-input v-model="temp.thumb" placeholder="Please input" style="width: 500px" type="url"/>
            </el-form-item>
            <el-form-item label="Images">
                <el-form-item v-for="(img,index) in temp.images" :key="index"  :prop="'img' + index">
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
            <el-form-item label="Time Reload" prop="time_reload">
                <el-input v-model="temp.timeReload" placeholder="" style="width: 80px" type="number" min="10"/>
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
    import axios from "axios";
    import ElDragSelect from '../../components/DragSelect' // base on element-ui
    import {statusOptions} from "../../const";
    import {urlPath} from "../../const";

    export default {
        components: {ElDragSelect},
        name: 'ModalCreate',
        data: () => ({
            finds: [],
            adTypes: [{title: 'Interstitial', id: 1}, {title: 'Banner', id: 2}, {title: 'Native', id: 3}],
            statusOptions: statusOptions,
            dialogStatus: '',
            rules: {
                adType: [
                    { required: true, message: 'Please select adType', trigger: 'change' }
                ],
                title: [{required: true, message: 'title is required', trigger: 'blur'}],
                url: [
                    {type: 'url',required: true, message: 'Please input url', trigger: 'blur'},
                ],
                thumb: [
                    {type: 'url',required: true, message: 'Please input url', trigger: 'blur'},
                ],

                location: [{required: true}],
                status: [{required: true}],
                timeReload: [{required: true, message: 'Time reload required', trigger: 'blur'}]

            },
            value: [],
            countries: []
        }),

        props: {
            temp: {},
            isVisible: {
                type: Boolean,
                require: true
            }
        },

        computed: {
            IsShowModal: {
                get: function () {
                    return this.isVisible
                },
                set: function () {
                    this.$emit('enlarge-text');
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
                this.$emit('modal-confirm');
                    this.$refs[formRef].validate((valid) => {
                        if (valid) {
                            console.log('submit!');
                        } else {
                            alert('error submit!');
                            console.log('error submit!!');
                            return false;
                        }
                    });


            },
            cancel() {
                this.$emit('enlarge-text');
            }
        },
        created() {
            axios
                .get(urlPath("/country/all"))
                .then(response => (this.countries = response.data , console.log(response.data)))
                .catch(error => console.log(error));

        }
    }

</script>

<style>

</style>
