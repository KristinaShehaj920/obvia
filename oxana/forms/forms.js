import { MetaProps } from "/flowerui/oxana/forms/metaProps.js";
import { ComponentList } from "/flowerui/oxana/forms/componentList.js";
import { Literals } from "/flowerui/oxana/forms/componentLiterals.js";
import { DependencyContainer } from "/flowerui/lib/DependencyContainer.js";
import { FormProperties } from "/flowerui/oxana/forms/model/FormProperties.js";
import { ViewStack } from "/flowerui/components/base/ViewStack.js";
import { App } from "/flowerui/components/base/App.js";
//the dataPromise function should return the dataObject when resolved
//data will be loaded only once :)
let SimpleContainer = DependencyContainer.getInstance();
SimpleContainer.register("MetaProps", MetaProps, DependencyContainer.simpleResolve);
var Builder = {};
var _initDP = function () {
    // Builder.masks;
    // Builder.maskValueField = "";
    // Builder.maskLabelField = "";

    // Builder.componentValueField = "ctor";
    // Builder.componentLabelField = "label";

    // Builder.providerValueField = "dataview_id";
    // Builder.providerLabelField = "description";
    // Builder.selectedForm = new FormProperties();

    // let api_dv_dataviews = new GaiaAPI_DV_dataviews();
    // let api_dv_forms = new GaiaAPI_dataview_pid_1();
    // let api_frmsDv_dataviews = new GaiaAPI_FrmsDv_dataview(); //frm dv
    // Builder.recordsPerPage = 5;

    // let raDvs = new RemoteArray({
    //     recordsPerPage: Builder.recordsPerPage, // pagination
    //     fetchPromise: function (p) {
    //         let dvInp = new dvInput();
    //         dvInp.tableData = new tableData({
    //             currentRecord: p.startPage * p.recordsPerPage,
    //             recordsPerPage: p.recordsPerPage
    //         });
    //         return api_dv_dataviews.dataview_pid_2Client.post(dvInp);
    //     }
    // });

    // let raFrms = new RemoteArray({
    //     recordsPerPage: 5, // pagination
    //     fetchPromise: function (p) {
    //         let dvInp = new dvInput();
    //         dvInp.tableData = new tableData({
    //             currentRecord: p.startPage * p.recordsPerPage,
    //             recordsPerPage: p.recordsPerPage
    //         });
    //         if (p.filterData) {
    //             dvInp.advancedSqlFilters = p.filterData;
    //         }
    //         return api_dv_forms.dataview_pid_1Client.post(dvInp);
    //     }
    // });

    // let raFrmsDataview = new RemoteArray({
    //     recordsPerPage: 5, // pagination
    //     fetchPromise: function (p) {
    //         let dvInp = new dvInput();
    //         dvInp.tableData = new tableData({
    //             currentRecord: p.startPage * p.recordsPerPage,
    //             recordsPerPage: p.recordsPerPage
    //         });

    //         return api_frmsDv_dataviews.dataview_pid_7Client.post(dvInp);
    //     }
    // });


    // Builder.sources = new ArrayEx(raDvs);
    // Builder.forms = new ArrayEx(raFrms);
    // Builder.dataviews = new ArrayEx(raFrmsDataview);
    // Builder.data = {};

    // return Promise.all([Builder.forms.init(), Builder.sources.init(), Builder.dataviews.init()]).then(function (result) {
    //     Builder.componentList = ComponentList;
    //     return Builder;
    // });
}();

var _initDpForms = function () {
    let api_dv_forms = new GaiaAPI_dataview_pid_1();
    let raFrms = new RemoteArray({
        recordsPerPage: 15, // pagination
        fetchPromise: function (p) {
            let dvInp = new dvInput();
            dvInp.tableData = new tableData({
                currentRecord: p.startPage * p.recordsPerPage,
                recordsPerPage: p.recordsPerPage
            });
            if (p.filterData) {
                dvInp.advancedSqlFilters = p.filterData;
            }
            return api_dv_forms.dataview_pid_1Client.post(dvInp);
        }
    });
    Builder.formList = new ArrayEx(raFrms);

    return Promise.all([Builder.formList.init()]).then(function (result) {
        return Builder;
    });
};

//this function will decide where the view will go in the GUI on endDraw
//principles to follow
//a view should be added to one of its parent`s children
var uiRoute = function (applet) {
    //check applet.attached if you want to addChild only when its not already
    let _appendTo = "viewStack";
    let viewContainer = applet.parentApplet.find(_appendTo);
    return viewContainer.addChild(applet);
};
var modalRoute = function (applet) {
    if (applet.attached) {
        applet.show();
    } else {
        applet.render().then(function (cmpInstance) {
            applet.show();
        });
    }
};

var oxana = new App({
    applets: [{
            url: "./flowerui/oxana/forms/applets/main/",
            anchor: "main",
            dataPromise: _initDP,
            "uiRoute": uiRoute
            //forceReload: true
        },
        {
            url: "./flowerui/oxana/forms/applets/saveForm/",
            anchor: "saveForm",
            dataPromise: _initDP,
            "uiRoute": modalRoute
            //forceReload: true
        },
        {
            url: "./flowerui/oxana/forms/applets/formsModal/",
            anchor: "formsModal",
            dataPromise: _initDpForms,
            "uiRoute": modalRoute
            //forceReload: true
        }
    ],
    components: [{
        ctor: ViewStack,
        props: {
            id: "viewStack",
            type: "",
            components: []
        }
    }]
});

//data should be loaded before calling renderPromise so that the current applet (the one in the url) implementation can access it
oxana.render().then(function (cmpInstance) {
    $(document.body).append(cmpInstance.$el);
});
export {
    oxana  
};