var gridster;
let inputDragonelabelSqlInstance;
let inputDragcardlabelSqlInstance;
let inputDragtableSqlInstance;
let inputDraggaugeSqlInstance;
let inputDragpieSqlInstance;
let inputDragbarSqlInstance;
let inputDraglineSqlInstance;
var dragHttp = {
    postFromAjax: function (datasql, callback) {
        $.ajax({
            type: "Post",
            contentType: 'application/x-www-form-urlencoded',
            url: 'http://localhost:1994/KanBan/GetJsonBySql',
            data: { sql: datasql },
            dataType: 'json',
            //xhrFields: { withCredentials: true },
            success: function (data) {
                if (data.code == 200) {
                    if (!!callback) {
                        callback(data.data);
                    }
                }
            },
            error: function (xhr) {
                console.log(xhr.responseText);
            }
        });
    }
};


var dragUpdateAttr = {
    updateElementAttributes: function (element, attributes) {
        for (let key in attributes) {
            if (attributes.hasOwnProperty(key)) {
                element.setAttribute(key, attributes[key]);
            }
        }
    }
}

const dragConst = {
    scaledWidth: 1,
    scaledHeight: 1,
    millisecondsToMinutes: 60000,
    barTypes: ["bar", "bar", "bar", "bar", "bar", "bar", "bar", "bar", "bar", "bar", "bar", "bar", "bar", "bar", "bar", "bar", "bar", "bar"],
    lineTypes: ["line", "line", "line", "line", "line", "line", "line", "line", "line", "line", "line", "line", "line", "line", "line", "line", "line", "line"],
    addThousandSeparator: function (number) {//千位分割
        const numStr = String(number).trim();
        return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
    tabMenu: function (url, name) {
        AddTabMenu(name, url, name, 'warning.png', 'true', 'true');
    },
    expandedSelect: function (id) {
        if ($("#" + id).css('display') == "block") {
            $("#" + id).slideUp();
        } else if ($("#" + id).css('display') == "none") {
            $("#" + id).slideDown();
        }
    }
}

var dragScroll = {
    autoScroll: function (divid) {
        var box = $("#" + divid).children("div").children("div").children("div")[0];
        var l1 = $("#" + divid).children("div").children("div").children("div").children("table").children("tbody")[0];
        var l2 = $("#" + divid).children("div").children("div").children("div").children("table").children("tbody")[1];
        if (l1.offsetHeight > box.offsetHeight) {
            l2.innerHTML = l1.innerHTML;
            var scrollMove = setInterval(function () {
                if ($("#" + divid).children("div").children("div").children("div")[0] == undefined) {
                    clearInterval(scrollMove);
                } else {
                    dragScroll.scrollup(box, l1);
                }
            }, 30);//数值越大，滚动速度越慢
            box.onmouseout = function () {
                scrollMove = setInterval(function () {
                    if ($("#" + divid).children("div").children("div").children("div")[0] == undefined) {
                        clearInterval(scrollMove);
                    } else {
                        if (l1.offsetHeight > box.offsetHeight) {
                            l2.innerHTML = l1.innerHTML;
                        } else { l2.innerHTML = ""; }
                        dragScroll.scrollup(box, l1);
                    }
                }, 30);
            }
            box.onmouseover = function () {
                clearInterval(scrollMove);
            }
        }
    },
    scrollup: function (box, l1) {
        //滚动条距离顶部的值恰好等于list1的高度时，达到滚动临界点，此时将让scrollTop=0,让list1回到初始位置，实现无缝滚动
        if (box.scrollTop >= l1.offsetHeight) {
            box.scrollTop = 0;
        } else { box.scrollTop++; }
    }
}

var findNextRow = function () {
    var listItems = $(".gs-w");

    var maxDataRow = 0;
    var maxSizeY = 1;
    listItems.each(function () {
        var currentDataRow = parseInt($(this).attr("data-row"));
        var currentSizeY = parseInt($(this).attr("data-sizey"));
        if (currentDataRow > maxDataRow) {
            maxDataRow = currentDataRow;
            maxSizeY = currentSizeY;
        }
    });

    return maxDataRow + maxSizeY;
}

//1.font-size 2.color 3.display 4.text-align/float 5.padding
var dragDivChange = {
    addDiv: function (tagClass) {
        var dragheight = 1;
        var dragwidth = 1;
        if (tagClass == "dragcardlabel") {
            dragwidth = 4;
            dragheight = 3;
            var divNum = $("." + tagClass).length + 1;
            if (!($("#" + tagClass + divNum).attr("id") == undefined)) {
                divNum = Date.now();
            }
            const draglabelParams = {
                draglabelTitleFont: "font-size: 15px!important;color: #707070!important;",
                draglabelCountFont: "font-size: 24px;color: black;",
                draglabelTitle2Font: "font-size: 12px!important;color: #707070!important;",
                draglabelCount2Font: "font-size: 15px!important;color: #13bfa6!important;",
                draglabelSql: `select COUNT(1) 今日发送总量,COUNT(1)+1080 昨日发送总量 from Push_Record`,
                draglabelImage: "ion-android-mail",
                draglabelBG: "bg-light-blue",
                draglabelTime: 10,
                dragCardColor: "#FFFFFF",
                draglabelImageStyle: "font-size:80px;color:#FFFFFF;",
            };
            const strs = draglabelParams.draglabelImageStyle.split(";");
            const draglabelImageSize = strs[0].split(":")[1].replace("px", "");
            const draglabelImageDivSize = draglabelImageSize * 1.25;
            const ImageDivStyle1 = `border-radius:${draglabelImageDivSize}px;width:${draglabelImageDivSize}px;height:${draglabelImageDivSize}px;line-height:${draglabelImageDivSize}px;`;
            const ImageDivStyle2 = `font-size: ${draglabelImageSize}px;`;
            const htmlAttributes = Object.entries(draglabelParams)
                .map(([param, value]) => ` ${param}="${value}"`)
                .join("");
            dragHttp.postFromAjax(draglabelParams.draglabelSql, function (data) {
                var html = `<li><div id="dragcardlabel${divNum}" class="dragcardlabel handle-resize" >`;
                const json = JSON.parse(data);
                const jsonCount = json.length;
                if (jsonCount === 0) {
                    return;
                }
                const keys = Object.keys(json[0]);
                const values = Object.values(json[0]);
                html += `<div ${htmlAttributes}
              style="display:none;" ></div>`;
                html += `<div class="card"><div class="card-body">
                  <div class="row"><div class="col">
                      <h3 style="${draglabelParams.draglabelCountFont}" class="mb-2 fw-semibold">${dragConst.addThousandSeparator(values[0])}</h3>
                      <p style="${draglabelParams.draglabelTitleFont}" class="text-muted fs-15 mb-0">${keys[0]}</p>`;
                if (keys.length > 1) {
                    html += `
                      <p style="${draglabelParams.draglabelTitle2Font}" class="text-muted mb-0 mt-2 fs-12">
                          <span style="${draglabelParams.draglabelCount2Font}" class="icn-box text-success fw-semibold fs-15 me-1">
                              ${dragConst.addThousandSeparator(values[1])}</span>
                              ${keys[1]} </p>`;
                }
                html += `
                          </div>
                          <div class="col col-auto top-icn" style="${ImageDivStyle2}">
                              <div class="counter-icon ${draglabelParams.draglabelBG} dash ms-auto box-shadow-primary" style="${ImageDivStyle1}">
                                  <i class="ion ${draglabelParams.draglabelImage}" style="${draglabelParams.draglabelImageStyle}"></i>
                              </div>
                          </div>
                  </div>
                  </div>
               </div>`;
                html += `
          </div>
          </li>`;
                gridster.add_widget(html, dragwidth * dragConst.scaledWidth, dragheight * dragConst.scaledHeight, 1, findNextRow());
            });
        }
        if (tagClass == "dragonelabel") {
            var divNum = $("." + tagClass).length + 1;
            if (!($("#" + tagClass + divNum).attr("id") == undefined)) {
                divNum = Date.now();
            }
            dragwidth = 4;
            dragheight = 3;
            const draglabelParams = {
                draglabelTitleFont: "font-size:15px;color: #FFFFF;",
                draglabelCountFont: "font-size: 38px;color: #FFFFF;",
                draglabelLink: "/CommonModule/Push_Data/Index",
                draglabelLinkTitle: "链接",
                draglabelLinkFont: "font-size: 14px;color: rgba(255, 255, 255, 0.8);display:block;",
                draglabelSql: `select COUNT(1) 发送总量 from Push_Record`,
                draglabelImage: "ion-android-mail",
                draglabelImageStyle: "font-size:120px;color:rgba(0, 0, 0, 0.15);",
                draglabelBG: "bg-light-blue",
                draglabelTime: 10,
            };
            const htmlAttributes = Object.entries(draglabelParams)
                .map(([param, value]) => ` ${param}="${value}"`)
                .join("");
            var html = `<li><div id="dragonelabel${divNum}" class="dragonelabel small-box ${draglabelParams.draglabelBG} handle-resize" >`;
            dragHttp.postFromAjax(draglabelParams.draglabelSql, function (data) {
                var json = JSON.parse(data);
                var jsonCount = json.length;
                var keys = Object.keys(json[0]);
                var values = Object.values(json[0]);
                if (jsonCount > 0) {
                    html += `<div ${htmlAttributes}
              style="display:none;" ></div>`;
                    html += `<div><div class="inner"><div class="inner-count" style="${draglabelParams.draglabelCountFont}">${values[0]}</div>
              <div class="inner-title" style="${draglabelParams.draglabelTitleFont}">${keys[0]}</div></div>`;
                    html += `<div class="icon" style="${draglabelParams.draglabelImageStyle}">
                      <i class="ion ${draglabelParams.draglabelImage}"></i>
                  </div>`;
                    html += `<a onclick="dragConst.tabMenu('${draglabelParams.draglabelLink}', '${draglabelParams.draglabelLinkTitle}')"  class="small-box-footer" href="###" style="${draglabelParams.draglabelLinkFont}">${draglabelParams.draglabelLinkTitle}<i class="fa fa-arrow-circle-right"></i></a>`;
                }
                html += `
          </div>
          </div>
          </li>`;
                gridster.add_widget(html, dragwidth * dragConst.scaledWidth, dragheight * dragConst.scaledHeight, 1, findNextRow());
            });

        }
        if (tagClass == "draglabel") {
            var divNum = $("." + tagClass).length + 1;
            if (!($("#" + tagClass + divNum).attr("id") == undefined)) {
                divNum = Date.now();
            }
            dragwidth = 2;
            dragheight = 2;
            var draglabelTitle = "推送汇总";
            var draglabelTitleFont = "font-size: 30px";
            var draglabelCTitleFont = "font-size: 15px;";
            var draglabelCCountFont = "font-size: 20px;";
            var draglabelCLinkFont = "font-size: 15px;";
            var sql = `SELECT cast(COUNT(1) as nvarchar) 发送总量,CAST(SUM(case IsRead when 1 then 1 else 0 end)as nvarchar) 已读
      ,CAST(SUM(case IsRead when 0 then 1 else 0 end) as nvarchar) 未读 FROM Push_Record
      UNION
      (Select 'url1','url2','url3') `;
            var html = `<li><div class="card"><div class="card-body"><div id="draglabel` + divNum + `" class="draglabel handle-resize" >`;
            html += `<div draglabelSql="` + sql + `" draglabelTitle="` + draglabelTitle + `" 
      draglabelTitleFont="`+ draglabelTitleFont + `" draglabelCTitleFont="` + draglabelCTitleFont + `" 
      draglabelCCountFont="`+ draglabelCCountFont + `" draglabelCLinkFont="` + draglabelCLinkFont + `"
      style="display:none;" ></div>`;
            html += `<div style="` + draglabelTitleFont + `">` + draglabelTitle + `</div>
      `;
            dragHttp.postFromAjax(sql, function (data) {
                var json = JSON.parse(data);
                var jsonCount = json.length;
                var keys = Object.keys(json[0]);
                var values = Object.values(json[0]);
                dragwidth = Math.ceil(keys.length / 1.5);
                dragheight = Math.ceil(values.length / 3);
                var percentage = 100 / keys.length;
                var urls = "";
                if (jsonCount > 1) {
                    urls = Object.values(json[1]);
                }
                for (var x = 0; x < keys.length; x++) {
                    html += `
          <div style="width: `+ percentage + `%; height: 100%; float: left">
              <div style="`+ draglabelCTitleFont + `">` + keys[x] + `</div>
              <div style="`+ draglabelCCountFont + `">` + values[x] + `</div>`
                    if (urls != "" && urls[x] != "" && urls[x] != " ") {
                        html += `<a target="_blank" href="` + urls[x] + `" style="` + draglabelCLinkFont + `">` + keys[x] + `</a>`;
                    }
                    html += `</div>`;
                }
                html += `
          </div>
          </div></div>
          </li>`;
                gridster.add_widget(html, dragwidth * dragConst.scaledWidth, dragheight * dragConst.scaledHeight, 1, findNextRow());
            });
        }
        if (tagClass == "draglink") {
            var divNum = $("." + tagClass).length + 1;
            if (!($("#" + tagClass + divNum).attr("id") == undefined)) {
                divNum = Date.now();
            }
            dragheight = 2;
            dragwidth = 2;
            const dragParams = {
                draglinkImage: "ion-android-document",
                draglinkBG: "bg-light-blue",
                draglinkTitle: "链接",
                draglinkTitleFont: "font-size:15px;color:#FFFFF;",
                draglink: "/CommonModule/Push_Data/Index",
                draglinkLabel: "链接",
                draglinkStyle: "font-size: 14px;color: rgba(255, 255, 255, 0.8);",
                draglinkImageStyle: "font-size:60px;color:rgba(0, 0, 0, 0.15);",
            };
            const divAttributes = Object.entries(dragParams)
                .map(([param, value]) => ` ${param}="${value}"`)
                .join("");
            var html = `<li><div id="draglink` + divNum + `" class="draglink small-box ` + dragParams.draglinkBG + ` handle-resize" >`;
            html += `<div ${divAttributes} style="display:none;" ></div>`;
            html += `<div><div class="inner">
                      <div class="inner-title" style="`+ dragParams.draglinkTitleFont + `">` + dragParams.draglinkTitle + `</div>
                  </div>
                  <div class="icon" style="${dragParams.draglinkImageStyle}">
                      <i class="ion `+ dragParams.draglinkImage + `"></i>
                  </div>
                  <a onclick="dragConst.tabMenu('${dragParams.draglink}', '${dragParams.draglinkTitle}')"  href="###" class="small-box-footer" style="` + dragParams.draglinkStyle + `">` + dragParams.draglinkLabel + ` <i class="fa fa-arrow-circle-right"></i></a>
              `;
            html += `
          </div>
          </div>
          </li>`;
            gridster.add_widget(html, dragwidth * dragConst.scaledWidth, dragheight * dragConst.scaledHeight, 1, findNextRow());
        }
        if (tagClass == "dragcardlink") {
            var divNum = $("." + tagClass).length + 1;
            if (!($("#" + tagClass + divNum).attr("id") == undefined)) {
                divNum = Date.now();
            }
            dragheight = 2;
            dragwidth = 2;
            const dragParams = {
                draglinkImage: "fa fa-file-text",
                draglinkImageStyle: "font-size: 20px;color:#3c8dbc;display:block;",
                draglinkTitle: "成型计划监控",
                draglinkTitleFont: "font-size:9pt;color:#3c8dbc;",
                draglink: "/CommonModule/Push_Data/Index",
                dragCardColor: "#FFFFFF",
            };
            const divAttributes = Object.entries(dragParams)
                .map(([param, value]) => ` ${param}="${value}"`)
                .join("");

            var html = `<li><div id="dragcardlink` + divNum + `" class="dragcardlink handle-resize" >`;
            html += `<div ${divAttributes} style="display:none;" ></div>`;
            html += `<div class="card">
                      <div class="card-body" style="text-align: center;">
                          <a onclick="dragConst.tabMenu('${dragParams.draglink}', '${dragParams.draglinkTitle}')"  href="###">
                              <i class="${dragParams.draglinkImage}" style="${dragParams.draglinkImageStyle}"></i>
                              <span style="${dragParams.draglinkTitleFont}">${dragParams.draglinkTitle}</span>
                          </a>
                      </div>
                  </div>
              `;
            html += `
          </div>
          </li>`;
            gridster.add_widget(html, dragwidth * dragConst.scaledWidth, dragheight * dragConst.scaledHeight, 1, findNextRow());
        }
        if (tagClass == "dragtable") {
            var divNum = $("." + tagClass).length + 1;
            if (!($("#" + tagClass + divNum).attr("id") == undefined)) {
                divNum = Date.now();
            }
            const dragParams = {
                dragtableTitle: "表格展示",
                dragtableTitleFont: "font-size:15px;color:rgb(51, 51, 51);display:block;text-align:left;",
                dragtableTitleBefore: "card-header-before-blue",
                dragtableSql: `select IsRead 已读,SentDate 时间 from Push_Record union all select 12, '2022-01-01' union all select 13,'2023-01-01' `,
                dragtableTime: 10,
                dragCardColor: "#FFFFFF",
                dragtableType: "table table-condensed",
                dragtableLinkName: "更多",
                dragtableLinkPath: "/CommonModule/Push_Data/Index",
                dragtableLinkStyle: "font-size:15px;color:#337ab7;display:block;float:right;",
                dragtableTheadStyle: "font-size:15px;color:#333;display:table-cell;text-align:center;padding:5px;",
                dragtableTbodyStyle: "font-size:15px;color:#333;display:table-cell;text-align:center;padding:5px;",
            };
            const divttributes = Object.entries(dragParams)
                .map(([param, value]) => ` ${param}="${value}"`)
                .join("");

            var html = `<li><div id="dragtable${divNum}" class="dragtable handle-resize" >`;
            html += `<div ${divttributes} style="display:none;" ></div>`;
            html += `<div class="card"><div class="card-header" style="${dragParams.dragtableTitleFont}">
                      <span class="${dragParams.dragtableTitleBefore}">${dragParams.dragtableTitle}</span>
                      <a href="javascript:void(0);" onclick="dragConst.tabMenu('${dragParams.dragtableLinkPath}', '${dragParams.dragtableTitle}')" style="${dragParams.dragtableLinkStyle}">${dragParams.dragtableLinkName}</a>
                  </div>`;
            html += `<div class="card-body">`;
            html += `<div class="tableScroll">`;
            dragHttp.postFromAjax(dragParams.dragtableSql, function (data) {
                var json = JSON.parse(data);
                var jsonCount = json.length;
                var keys = Object.keys(json[0]);
                var values = Object.values(json);
                dragwidth = 6;
                dragheight = 3;
                if (jsonCount > 0) {
                    html += `<table class="${dragParams.dragtableType}">`;
                    html += `<thead class="theadsticky" style="background-color:${dragParams.dragCardColor};"><tr>`;
                    for (var x = 0; x < keys.length; x++) {
                        html += `<th style="${dragParams.dragtableTheadStyle}">${keys[x]}</th>`;
                    }
                    html += `</tr></thead>`;
                    html += `<tbody class="tbody1">`;
                    for (var x = 0; x < values.length; x++) {
                        html += "<tr>";
                        for (var y = 0; y < keys.length; y++) {
                            html += `<td style="${dragParams.dragtableTbodyStyle}">${values[x][keys[y]]}</td>`;
                        }
                        html += `</tr>`;
                    }
                    html += `</tbody>`;
                    html += `<tbody class="tbody2"></tbody></table>`;
                }
                html += `
          </div>
          </div>
          </div></div>
          </li>`;
                gridster.add_widget(html, dragwidth * dragConst.scaledWidth, dragheight * dragConst.scaledHeight, 1, findNextRow());
                dragScroll.autoScroll(`dragtable${divNum}`);
            });
        }
        if (tagClass == "draggaugepic") {
            var divNum = $("." + tagClass).length + 1;
            if (!($("#" + tagClass + divNum).attr("id") == undefined)) {
                divNum = Date.now();
            }
            const dragParams = {
                dragPicTitle: "仪表盘图",
                //dragPicTitleLeft: "left",
                dragPicSql: `SELECT SUM(case IsRead when 1 then 1 else 0 end)*100/Count(1) 已读占比 FROM Push_Record;`,
                dragPicTime: 10,
                dragCardColor: "#FFFFFF",
                dragPicTitleFont: "font-size:15px;color:rgb(51, 51, 51);display:block;text-align:left;",
                dragPicTitleBefore: "card-header-before-blue",
                dragPicLinkName: "更多",
                dragPicLinkPath: "/CommonModule/Push_Data/Index",
                dragPicLinkStyle: "font-size:15px;color:#337ab7;display:block;float:right;",
                dragPicFontSize: 14,
            };
            const divAttributes = Object.entries(dragParams)
                .map(([param, value]) => ` ${param}="${value}"`)
                .join("");
            var html = `<li><div id="draggaugepic` + divNum + `" class="draggaugepic handle-resize">
                      <div ${divAttributes} style="display:none;" ></div>
                      <div class="card">
                      <div class="card-header" style="${dragParams.dragPicTitleFont}">
                      <span class="${dragParams.dragPicTitleBefore}">${dragParams.dragPicTitle}</span>
                      <a href="javascript:void(0);" onclick="dragConst.tabMenu('${dragParams.dragPicLinkPath}', '${dragParams.dragPicTitle}')" style="${dragParams.dragPicLinkStyle}">${dragParams.dragPicLinkName}</a>
                      </div>
                      <div class="card-body">`;
            dragHttp.postFromAjax(dragParams.dragPicSql, function (data) {
                var json = JSON.parse(data);
                var jsonCount = json.length;
                var option = "";
                var keys = Object.keys(json[0]);
                var values = Object.values(json[0]);
                dragwidth = 6;
                dragheight = 9;
                if (jsonCount > 0) {
                    option = {
                        textStyle: {
                            fontSize: dragParams.dragPicFontSize
                        },
                        //title: {
                        //    text: dragParams.dragPicTitle,
                        //    left: dragParams.dragPicTitleLeft
                        //},
                        tooltip: {
                            formatter: '{a} <br/>{b} : {c}%'
                        },
                        toolbox: {
                            show: true,
                            feature: {
                                mark: { show: true },
                                dataView: { show: true, readOnly: false },
                                restore: { show: true },
                                saveAsImage: { show: true }
                            }
                        },
                        series: [
                            {
                                name: dragParams.dragPicTitle,
                                type: 'gauge',
                                detail: {
                                    formatter: '{value}'
                                },
                                data: [
                                    {
                                        value: values[0],
                                        name: keys[0]
                                    }
                                ]
                            }
                        ]
                    };
                }
                html += `
          </div></div></div>
          </li>`;
                gridster.add_widget(html, dragwidth * dragConst.scaledWidth, dragheight * dragConst.scaledHeight, 1, findNextRow());
                var mydiv = $("#draggaugepic" + divNum).children("div").children("div")[1];
                var myChart = echarts.init(mydiv);
                myChart.setOption(option);
                mydiv.setAttribute("myChart_id", myChart.id);
            });
        }
        if (tagClass == "dragpiepic") {
            var divNum = $("." + tagClass).length + 1;
            if (!($("#" + tagClass + divNum).attr("id") == undefined)) {
                divNum = Date.now();
            }
            const dragParams = {
                dragPicTitle: "饼状图",
                dragPicTitleLeft: "left",
                dragPicSql: `SELECT SUM(case IsRead when 1 then 1 else 0 end) 已读,SUM(case IsRead when 0 then 1 else 0 end) 未读 FROM Push_Record;`,
                dragPicTime: 10,
                dragCardColor: "#FFFFFF",
                dragPicTitleFont: "font-size:15px;color:rgb(51, 51, 51);display:block;text-align:left;",
                dragPicTitleBefore: "card-header-before-blue",
                dragPicLinkName: "更多",
                dragPicLinkPath: "/CommonModule/Push_Data/Index",
                dragPicLinkStyle: "font-size:15px;color:#337ab7;display:block;float:right;",
                dragPicFontSize: 14,
            };
            const divAttributes = Object.entries(dragParams)
                .map(([param, value]) => ` ${param}="${value}"`)
                .join("");
            var html = `<li><div id="dragpiepic` + divNum + `" class="dragpiepic handle-resize">
                      <div ${divAttributes} style="display:none;" ></div>
                      <div class="card">
              <div class="card-header" style="${dragParams.dragPicTitleFont}">
                      <span class="${dragParams.dragPicTitleBefore}">${dragParams.dragPicTitle}</span>
                      <a href="javascript:void(0);" onclick="dragConst.tabMenu('${dragParams.dragPicLinkPath}', '${dragParams.dragPicTitle}')" style="${dragParams.dragPicLinkStyle}">${dragParams.dragPicLinkName}</a>
                      </div>
                      <div class="card-body">`;
            dragHttp.postFromAjax(dragParams.dragPicSql, function (data) {
                var json = JSON.parse(data);
                var jsonCount = json.length;
                var option = "";
                var keys = Object.keys(json[0]);
                var values = Object.values(json);
                var datas = $.map(keys, (key) => ({
                    value: values[0][key],
                    name: key
                }));
                dragheight = 6;
                dragwidth = 4;
                if (jsonCount > 0) {
                    option = {
                        textStyle: {
                            fontSize: dragParams.dragPicFontSize
                        },
                        tooltip: {
                            trigger: 'item'
                        },
                        legend: {
                            top: 'bottom'
                        },
                        toolbox: {
                            show: true,
                            feature: {
                                mark: { show: true },
                                dataView: { show: true, readOnly: false },
                                restore: { show: true },
                                saveAsImage: { show: true }
                            }
                        },
                        series: [
                            {
                                name: dragParams.dragPicTitle,
                                type: 'pie',
                                //radius: [50, 250],
                                center: ['50%', '50%'],
                                roseType: 'area',//radius
                                itemStyle: {
                                    borderRadius: 8
                                },
                                data: datas
                            }
                        ]
                    };

                }
                html += `
          </div></div></div>
          </li>`;
                gridster.add_widget(html, dragwidth * dragConst.scaledWidth, dragheight * dragConst.scaledHeight, 1, findNextRow());
                var mydiv = $("#dragpiepic" + divNum).children("div").children("div")[1];
                var myChart = echarts.init(mydiv);
                myChart.setOption(option);
                mydiv.setAttribute("myChart_id", myChart.id);
            });
        }
        if (tagClass == "dragbarpic") {
            var divNum = $("." + tagClass).length + 1;
            if (!($("#" + tagClass + divNum).attr("id") == undefined)) {
                divNum = Date.now();
            }
            dragheight = 24;
            dragwidth = 16;
            const dragParams = {
                dragPicTitle: "柱状图",
                dragPicTitleLeft: "left",
                dragPicSql: `SELECT '数据推送' 标题,COUNT(1) 总量,SUM(case IsRead when 1 then 1 else 0 end) 已读,SUM(case IsRead when 0 then 1 else 0 end) 未读 FROM Push_Record
      UNION
      SELECT '数据推送2' 标题,COUNT(1)+699 总量,SUM(case IsRead when 1 then 1 else 0 end)+829 已读,SUM(case IsRead when 0 then 1 else 0 end)-130 未读 FROM Push_Record
      UNION
      SELECT '数据推送3' 标题,COUNT(1)+99 总量,SUM(case IsRead when 1 then 1 else 0 end)+229 已读,SUM(case IsRead when 0 then 1 else 0 end)-130 未读 FROM Push_Record;`,
                dragPicTime: 10,
                dragCardColor: "#FFFFFF",
                dragPicTitleFont: "font-size:15px;color:rgb(51, 51, 51);display:block;text-align:left;",
                dragPicTitleBefore: "card-header-before-blue",
                dragPicLinkName: "更多",
                dragPicLinkPath: "/CommonModule/Push_Data/Index",
                dragPicLinkStyle: "font-size:15px;color:#337ab7;display:block;float:right;",
                dragPicFontSize: 14,
                dragPicTypes: "",
            };
            const divAttributes = Object.entries(dragParams)
                .map(([param, value]) => ` ${param}="${value}"`)
                .join("");
            var html = `<li>
                              <div id="dragbarpic` + divNum + `" class="dragbarpic handle-resize">
                              <div ${divAttributes} style="display:none;" ></div>
                              <div class="card">
                              <div class="card-header" style="${dragParams.dragPicTitleFont}">
                              <span class="${dragParams.dragPicTitleBefore}">${dragParams.dragPicTitle}</span>
                              <a href="javascript:void(0);" onclick="dragConst.tabMenu('${dragParams.dragPicLinkPath}', '${dragParams.dragPicTitle}')" style="${dragParams.dragPicLinkStyle}">${dragParams.dragPicLinkName}</a>
                              </div>
                          <div class="card-body">`;
            dragHttp.postFromAjax(dragParams.dragPicSql, function (data) {
                const json = JSON.parse(data);
                const jsonCount = json.length;
                let option = "";
                let legendDatas = Object.keys(json[0]);
                const values = Object.values(json);
                const keys = $.map(values, (item) => item[legendDatas[0]]);
                legendDatas.shift();
                const datas = legendDatas.map((key, index) => ({
                    name: key,
                    type: dragConst.barTypes[index],
                    data: json.map(item => item[key])
                }));


                //var keys=Object.keys(json[0]);
                //var values=Object.values(json);
                //var legendDatas=$.map(values, (item) => item[keys[0]]);
                //var datas = $.map(values, (item) => ({
                //    name: item[keys[0]],
                //    type: "bar",
                //    data: $.map(keys.slice(1), key => item[key])
                //  }));
                //if(!!keys){
                //    keys.shift();
                //    }
                dragwidth = Math.ceil(keys.length);
                dragheight = Math.ceil(values.length);
                if (dragwidth < 8) {
                    dragwidth = 8;
                }
                if (dragheight < 8) {
                    dragheight = 8;
                }
                if (jsonCount > 0) {
                    option = {
                        textStyle: {
                            fontSize: dragParams.dragPicFontSize
                        },
                        toolbox: {
                            show: true,
                            feature: {
                                mark: { show: true },
                                dataView: { show: true, readOnly: false },
                                restore: { show: true },
                                saveAsImage: { show: true }
                            }
                        },
                        tooltip: {
                            trigger: 'item'
                        },
                        grid: {
                            left: '3%',
                            right: '4%',
                            bottom: '3%',
                            containLabel: true
                        },
                        legend: {
                            data: legendDatas
                        },
                        xAxis: [
                            {
                                type: 'category',
                                data: keys,
                                axisTick: {
                                    alignWithLabel: true
                                }
                            }
                        ],
                        yAxis: [
                            {
                                type: 'value'
                            }
                        ],
                        series: datas
                    };

                }
                html += `
          </div></div></div>
          </li>`;
                gridster.add_widget(html, dragwidth * dragConst.scaledWidth, dragheight * dragConst.scaledHeight, 1, findNextRow());
                var mydiv = $("#dragbarpic" + divNum).children("div").children("div")[1];
                var myChart = echarts.init(mydiv);
                myChart.setOption(option);
                mydiv.setAttribute("myChart_id", myChart.id);
            });
        }
        if (tagClass == "draglinepic") {
            var divNum = $("." + tagClass).length + 1;
            if (!($("#" + tagClass + divNum).attr("id") == undefined)) {
                divNum = Date.now();
            }
            dragheight = 24;
            dragwidth = 16;
            const dragParams = {
                dragPicTitle: "折线图",
                dragPicTitleLeft: "left",
                dragPicSql: `SELECT '数据推送' 标题,COUNT(1) 总量,SUM(case IsRead when 1 then 1 else 0 end) 已读,SUM(case IsRead when 0 then 1 else 0 end) 未读 FROM Push_Record
      UNION
      SELECT '数据推送2' 标题,COUNT(1)+699 总量,SUM(case IsRead when 1 then 1 else 0 end)+829 已读,SUM(case IsRead when 0 then 1 else 0 end)-130 未读 FROM Push_Record
      UNION
      SELECT '数据推送3' 标题,COUNT(1)+99 总量,SUM(case IsRead when 1 then 1 else 0 end)+229 已读,SUM(case IsRead when 0 then 1 else 0 end)-130 未读 FROM Push_Record;`,
                dragPicTime: 10,
                dragCardColor: "#FFFFFF",
                dragPicTitleFont: "font-size:15px;color:rgb(51, 51, 51);display:block;text-align:left;",
                dragPicTitleBefore: "card-header-before-blue",
                dragPicLinkName: "更多",
                dragPicLinkPath: "/CommonModule/Push_Data/Index",
                dragPicLinkStyle: "font-size:15px;color:#337ab7;display:block;float:right;",
                dragPicFontSize: 14,
                dragPicTypes: "",
            };
            const divAttributes = Object.entries(dragParams)
                .map(([param, value]) => ` ${param}="${value}"`)
                .join("");
            var html = `<li>
                              <div id="draglinepic` + divNum + `" class="draglinepic handle-resize">
                              <div ${divAttributes} style="display:none;" ></div>
                              <div class="card">
                              <div class="card-header" style="${dragParams.dragPicTitleFont}">
                              <span class="${dragParams.dragPicTitleBefore}">${dragParams.dragPicTitle}</span>
                              <a href="javascript:void(0);" onclick="dragConst.tabMenu('${dragParams.dragPicLinkPath}', '${dragParams.dragPicTitle}')" style="${dragParams.dragPicLinkStyle}">${dragParams.dragPicLinkName}</a>
                              </div>
                          <div class="card-body"><div id="draglinepic` + divNum + `" class="draglinepic handle-resize" >`;
            dragHttp.postFromAjax(dragParams.dragPicSql, function (data) {
                var json = JSON.parse(data);
                var jsonCount = json.length;
                var option = "";
                let legendDatas = Object.keys(json[0]);
                const values = Object.values(json);
                const keys = $.map(values, (item) => item[legendDatas[0]]);
                legendDatas.shift();
                const datas = legendDatas.map(key => ({
                    name: key,
                    type: "line",
                    data: json.map(item => item[key])
                }));
                //var keys=Object.keys(json[0]);
                //var values=Object.values(json);
                //var legendDatas=$.map(values, (item) => item[keys[0]]);
                //var datas = $.map(values, (item) => ({
                //    name: item[keys[0]],
                //    type: "line",
                //    data: $.map(keys.slice(1), key => item[key])
                //  }));
                //if(!!keys){
                //    keys.shift();
                //}
                dragwidth = Math.ceil(keys.length);
                dragheight = Math.ceil(values.length);
                if (dragwidth < 8) {
                    dragwidth = 8;
                }
                if (dragheight < 8) {
                    dragheight = 8;
                }
                if (jsonCount > 0) {
                    option = {
                        textStyle: {
                            fontSize: dragParams.dragPicFontSize
                        },
                        toolbox: {
                            show: true,
                            feature: {
                                mark: { show: true },
                                dataView: { show: true, readOnly: false },
                                restore: { show: true },
                                saveAsImage: { show: true }
                            }
                        },
                        tooltip: {
                            trigger: "axis",
                        },
                        legend: {
                            data: legendDatas,
                        },
                        xAxis: {
                            type: "category",
                            boundaryGap: false,
                            data: keys,
                        },
                        yAxis: {
                            type: "value",
                        },
                        series: datas,
                    };
                }
                html += `
          </div></div></div>
          </li>`;
                gridster.add_widget(html, dragwidth * dragConst.scaledWidth, dragheight * dragConst.scaledHeight, 1, findNextRow());
                var mydiv = $("#draglinepic" + divNum).children("div").children("div")[1];
                var myChart = echarts.init(mydiv);
                myChart.setOption(option);
                mydiv.setAttribute("myChart_id", myChart.id);
            });
        }
        if (tagClass == "draghidediv") {
            var divNum = $("." + tagClass).length + 1;
            if (!($("#" + tagClass + divNum).attr("id") == undefined)) {
                divNum = Date.now();
            }
            var html = `<li>
              <div id="draghidediv"${divNum} class="draghidediv handle-resize">
                  <div class="card"></div>
              </div>
          </li>`;
            gridster.add_widget(html, dragwidth * dragConst.scaledWidth, dragheight * dragConst.scaledHeight, 1, findNextRow());
        }
    },
    delDiv: function (divId) {
        var tagClass = $('#' + divId).attr('class').split(" ")[0];
        var li = "";
        li = $('#' + divId).parent();
        gridster.remove_widget(li);
    },
    copyDiv: function (divId) {
        var tagClass = $('#' + divId).attr('class').split(" ")[0];
        if (tagClass == "draglabel" || tagClass == "dragonelabel" || tagClass == "dragtable" ||
            tagClass == "draglink" || tagClass == "dragcardlink" || tagClass == "dragcardlabel" ||
            tagClass == "draghidediv") {//拷贝
            try {
                var this_li = $('#' + divId).parent().parent().parent();
                if (tagClass == "dragonelabel" || tagClass == "draglink" || tagClass == "dragcardlink" || tagClass == "dragcardlabel" || tagClass == "draghidediv" || tagClass == "dragtable") {
                    this_li = $('#' + divId).parent();
                }
                var data_sizex = this_li.attr("data-sizex") - 0;//String变int
                var data_sizey = this_li.attr("data-sizey") - 0;
                var data_col = this_li.attr("data-col") - 0;
                var data_row = this_li.attr("data-row") - 0;
            } catch (err) {
                var data_col = 1;
                var data_row = 1;
            }
            var tagClass = $('#' + divId).attr('class').split(" ")[0];
            var divNum = $("." + tagClass).length + 1;
            if (!($("#" + tagClass + divNum).attr("id") == undefined)) {
                divNum = Date.now();
            }
            $('#' + divId).find(".hoveTag").remove();
            $('#' + divId).css("background-color", "initial");
            var html = "";
            if (tagClass == "dragonelabel" || tagClass == "draglink" || tagClass == "dragcardlink" || tagClass == "dragcardlabel" || tagClass == "draghidediv" || tagClass == "dragtable") {
                html = `<li>` + $('#' + divId).prop("outerHTML").replace('id="' + divId, 'id="' + tagClass + divNum) + `</li>`;
            }
            else {
                html = `<li><div class="card"><div class="card-body">` + $('#' + divId).prop("outerHTML").replace('id="' + divId, 'id="' + tagClass + divNum) + `</div></div></li>`;
            }
            gridster.add_widget(html, data_sizex, data_sizey, data_col, data_row);
            if (tagClass == "dragtable") {
                dragScroll.autoScroll(`${tagClass + divNum}`);
            }
        }
        if (tagClass == "draggaugepic") {
            try {
                var this_li = $('#' + divId).parent();
                var data_sizex = this_li.attr("data-sizex") - 0;//String变int
                var data_sizey = this_li.attr("data-sizey") - 0;
                var data_col = this_li.attr("data-col") - 0;
                var data_row = this_li.attr("data-row") - 0;
            } catch (err) {
                var data_col = 1;
                var data_row = 1;
            }
            var tagClass = $('#' + divId).attr('class').split(" ")[0];
            var divNum = $("." + tagClass).length + 1;
            if (!($("#" + tagClass + divNum).attr("id") == undefined)) {
                divNum = Date.now();
            }
            const dragParams = {
                dragPicTitle: $('#' + divId).children('div')[1].getAttribute('dragPicTitle'),
                dragPicSql: $('#' + divId).children('div')[1].getAttribute('dragPicSql'),
                dragPicTime: $('#' + divId).children('div')[1].getAttribute('dragPicTime'),
                dragCardColor: $('#' + divId).children('div')[1].getAttribute('dragCardColor'),
                dragPicTitleBefore: $('#' + divId).children('div')[1].getAttribute('dragPicTitleBefore'),
                dragPicTitleFont: $('#' + divId).children('div')[1].getAttribute('dragPicTitleFont'),
                dragPicLinkName: $('#' + divId).children('div')[1].getAttribute('dragPicLinkName'),
                dragPicLinkPath: $('#' + divId).children('div')[1].getAttribute('dragPicLinkPath'),
                dragPicLinkStyle: $('#' + divId).children('div')[1].getAttribute('dragPicLinkStyle'),
                dragPicFontSize: $('#' + divId).children('div')[1].getAttribute('dragPicFontSize'),
            };
            const divAttributes = Object.entries(dragParams)
                .map(([param, value]) => ` ${param}="${value}"`)
                .join("");
            var html = `<li><div id="draggaugepic` + divNum + `" class="draggaugepic handle-resize">
                      <div ${divAttributes} style="display:none;" ></div>
                      <div class="card" style="background-color:${dragParams.dragCardColor};">
                      <div class="card-header" style="${dragParams.dragPicTitleFont}">
                      <span class="${dragParams.dragPicTitleBefore}">${dragParams.dragPicTitle}</span>
                      <a href="javascript:void(0);" onclick="dragConst.tabMenu('${dragParams.dragPicLinkPath}', '${dragParams.dragPicTitle}')" style="${dragParams.dragPicLinkStyle}">${dragParams.dragPicLinkName}</a>
                      </div>
                      <div class="card-body">`;
            dragHttp.postFromAjax(dragParams.dragPicSql, function (data) {
                var json = JSON.parse(data);
                var jsonCount = json.length;
                var option = "";
                var keys = Object.keys(json[0]);
                var values = Object.values(json[0]);
                if (jsonCount > 0) {
                    option = {
                        textStyle: {
                            fontSize: dragParams.dragPicFontSize
                        },
                        tooltip: {
                            formatter: '{a} <br/>{b} : {c}%'
                        },
                        toolbox: {
                            show: true,
                            feature: {
                                mark: { show: true },
                                dataView: { show: true, readOnly: false },
                                restore: { show: true },
                                saveAsImage: { show: true }
                            }
                        },
                        series: [
                            {
                                name: dragParams.dragPicTitle,
                                type: 'gauge',
                                detail: {
                                    formatter: '{value}'
                                },
                                data: [
                                    {
                                        value: values[0],
                                        name: keys[0]
                                    }
                                ]
                            }
                        ]
                    };
                }
                html += `
          </div></div></div>
          </li>`;
                gridster.add_widget(html, data_sizex, data_sizey, data_col, data_row);
                var mydiv = $("#draggaugepic" + divNum).children("div").children("div")[1];
                var myChart = echarts.init(mydiv);
                myChart.setOption(option);
                mydiv.setAttribute("myChart_id", myChart.id);
            });
        }
        if (tagClass == "dragpiepic") {
            try {
                var this_li = $('#' + divId).parent();
                var data_sizex = this_li.attr("data-sizex") - 0;//String变int
                var data_sizey = this_li.attr("data-sizey") - 0;
                var data_col = this_li.attr("data-col") - 0;
                var data_row = this_li.attr("data-row") - 0;
            } catch (err) {
                var data_col = 1;
                var data_row = 1;
            }
            var tagClass = $('#' + divId).attr('class').split(" ")[0];
            var divNum = $("." + tagClass).length + 1;
            if (!($("#" + tagClass + divNum).attr("id") == undefined)) {
                divNum = Date.now();
            }
            const dragParams = {
                dragPicTitle: $('#' + divId).children('div')[1].getAttribute('dragPicTitle'),
                dragPicSql: $('#' + divId).children('div')[1].getAttribute('dragPicSql'),
                dragPicTime: $('#' + divId).children('div')[1].getAttribute('dragPicTime'),
                dragCardColor: $('#' + divId).children('div')[1].getAttribute('dragCardColor'),
                dragPicTitleBefore: $('#' + divId).children('div')[1].getAttribute('dragPicTitleBefore'),
                dragPicTitleFont: $('#' + divId).children('div')[1].getAttribute('dragPicTitleFont'),
                dragPicLinkName: $('#' + divId).children('div')[1].getAttribute('dragPicLinkName'),
                dragPicLinkPath: $('#' + divId).children('div')[1].getAttribute('dragPicLinkPath'),
                dragPicLinkStyle: $('#' + divId).children('div')[1].getAttribute('dragPicLinkStyle'),
                dragPicFontSize: $('#' + divId).children('div')[1].getAttribute('dragPicFontSize'),
            };
            const divAttributes = Object.entries(dragParams)
                .map(([param, value]) => ` ${param}="${value}"`)
                .join("");
            var html = `<li><div id="dragpiepic` + divNum + `" class="dragpiepic handle-resize">
                      <div ${divAttributes} style="display:none;" ></div>
                      <div class="card" style="background-color:${dragParams.dragCardColor};">
              <div class="card-header" style="${dragParams.dragPicTitleFont}">
                      <span class="${dragParams.dragPicTitleBefore}">${dragParams.dragPicTitle}</span>
                      <a href="javascript:void(0);" onclick="dragConst.tabMenu('${dragParams.dragPicLinkPath}', '${dragParams.dragPicTitle}')" style="${dragParams.dragPicLinkStyle}">${dragParams.dragPicLinkName}</a>
                      </div>
                      <div class="card-body">`;
            dragHttp.postFromAjax(dragParams.dragPicSql, function (data) {
                var json = JSON.parse(data);
                var jsonCount = json.length;
                var option = "";
                var keys = Object.keys(json[0]);
                var values = Object.values(json);
                var datas = $.map(keys, (key) => ({
                    value: values[0][key],
                    name: key
                }));
                if (jsonCount > 0) {
                    option = {
                        textStyle: {
                            fontSize: dragParams.dragPicFontSize
                        },
                        tooltip: {
                            trigger: 'item'
                        },
                        legend: {
                            top: 'bottom'
                        },
                        toolbox: {
                            show: true,
                            feature: {
                                mark: { show: true },
                                dataView: { show: true, readOnly: false },
                                restore: { show: true },
                                saveAsImage: { show: true }
                            }
                        },
                        series: [
                            {
                                name: dragParams.dragPicTitle,
                                type: 'pie',
                                center: ['50%', '50%'],
                                roseType: 'area',//radius
                                itemStyle: {
                                    borderRadius: 8
                                },
                                data: datas
                            }
                        ]
                    };

                }
                html += `
          </div></div></div>
          </li>`;
                gridster.add_widget(html, data_sizex, data_sizey, data_col, data_row);
                var mydiv = $("#dragpiepic" + divNum).children("div").children("div")[1];
                var myChart = echarts.init(mydiv);
                myChart.setOption(option);
                mydiv.setAttribute("myChart_id", myChart.id);
            });
        }
        if (tagClass == "dragbarpic") {
            try {
                var this_li = $('#' + divId).parent();
                var data_sizex = this_li.attr("data-sizex") - 0;//String变int
                var data_sizey = this_li.attr("data-sizey") - 0;
                var data_col = this_li.attr("data-col") - 0;
                var data_row = this_li.attr("data-row") - 0;
            } catch (err) {
                var data_col = 1;
                var data_row = 1;
            }
            var tagClass = $('#' + divId).attr('class').split(" ")[0];
            var divNum = $("." + tagClass).length + 1;
            if (!($("#" + tagClass + divNum).attr("id") == undefined)) {
                divNum = Date.now();
            }
            const dragParams = {
                dragPicTitle: $('#' + divId).children('div')[1].getAttribute('dragPicTitle'),
                dragPicSql: $('#' + divId).children('div')[1].getAttribute('dragPicSql'),
                dragPicTime: $('#' + divId).children('div')[1].getAttribute('dragPicTime'),
                dragCardColor: $('#' + divId).children('div')[1].getAttribute('dragCardColor'),
                dragPicTitleBefore: $('#' + divId).children('div')[1].getAttribute('dragPicTitleBefore'),
                dragPicTitleFont: $('#' + divId).children('div')[1].getAttribute('dragPicTitleFont'),
                dragPicLinkName: $('#' + divId).children('div')[1].getAttribute('dragPicLinkName'),
                dragPicLinkPath: $('#' + divId).children('div')[1].getAttribute('dragPicLinkPath'),
                dragPicLinkStyle: $('#' + divId).children('div')[1].getAttribute('dragPicLinkStyle'),
                dragPicFontSize: $('#' + divId).children('div')[1].getAttribute('dragPicFontSize'),
                dragPicTypes: $('#' + divId).children('div')[1].getAttribute('dragPicTypes'),
            };
            const divAttributes = Object.entries(dragParams)
                .map(([param, value]) => ` ${param}="${value}"`)
                .join("");
            var html = `<li>
                              <div id="dragbarpic` + divNum + `" class="dragbarpic handle-resize">
                              <div ${divAttributes} style="display:none;" ></div>
                              <div class="card" style="background-color:${dragParams.dragCardColor};">
                              <div class="card-header" style="${dragParams.dragPicTitleFont}">
                              <span class="${dragParams.dragPicTitleBefore}">${dragParams.dragPicTitle}</span>
                              <a href="javascript:void(0);" onclick="dragConst.tabMenu('${dragParams.dragPicLinkPath}', '${dragParams.dragPicTitle}')" style="${dragParams.dragPicLinkStyle}">${dragParams.dragPicLinkName}</a>
                              </div>
                          <div class="card-body">`;
            dragHttp.postFromAjax(dragParams.dragPicSql, function (data) {
                const json = JSON.parse(data);
                const jsonCount = json.length;
                let option = "";
                let legendDatas = Object.keys(json[0]);
                const values = Object.values(json);
                const keys = $.map(values, (item) => item[legendDatas[0]]);
                legendDatas.shift();
                const getTypes = dragParams.dragPicTypes.split(",");
                const newArr = dragConst.barTypes.map((value, index) => getTypes[index] || value);
                const datas = legendDatas.map((key, index) => ({
                    name: key,
                    type: newArr[index],
                    data: json.map(item => item[key])
                }));
                if (jsonCount > 0) {
                    option = {
                        textStyle: {
                            fontSize: dragParams.dragPicFontSize
                        },
                        toolbox: {
                            show: true,
                            feature: {
                                mark: { show: true },
                                dataView: { show: true, readOnly: false },
                                restore: { show: true },
                                saveAsImage: { show: true }
                            }
                        },
                        tooltip: {
                            trigger: 'item'
                        },
                        grid: {
                            left: '3%',
                            right: '4%',
                            bottom: '3%',
                            containLabel: true
                        },
                        legend: {
                            data: legendDatas
                        },
                        xAxis: [
                            {
                                type: 'category',
                                data: keys,
                                axisTick: {
                                    alignWithLabel: true
                                }
                            }
                        ],
                        yAxis: [
                            {
                                type: 'value'
                            }
                        ],
                        series: datas
                    };

                }
                html += `
          </div></div></div>
          </li>`;
                gridster.add_widget(html, data_sizex, data_sizey, data_col, data_row);
                var mydiv = $("#dragbarpic" + divNum).children("div").children("div")[1];
                var myChart = echarts.init(mydiv);
                myChart.setOption(option);
                mydiv.setAttribute("myChart_id", myChart.id);
            });
        }
        if (tagClass == "draglinepic") {
            try {
                var this_li = $('#' + divId).parent();
                var data_sizex = this_li.attr("data-sizex") - 0;//String变int
                var data_sizey = this_li.attr("data-sizey") - 0;
                var data_col = this_li.attr("data-col") - 0;
                var data_row = this_li.attr("data-row") - 0;
            } catch (err) {
                var data_col = 1;
                var data_row = 1;
            }
            var tagClass = $('#' + divId).attr('class').split(" ")[0];
            var divNum = $("." + tagClass).length + 1;
            if (!($("#" + tagClass + divNum).attr("id") == undefined)) {
                divNum = Date.now();
            }
            const dragParams = {
                dragPicTitle: $('#' + divId).children('div')[1].getAttribute('dragPicTitle'),
                dragPicSql: $('#' + divId).children('div')[1].getAttribute('dragPicSql'),
                dragPicTime: $('#' + divId).children('div')[1].getAttribute('dragPicTime'),
                dragCardColor: $('#' + divId).children('div')[1].getAttribute('dragCardColor'),
                dragPicTitleBefore: $('#' + divId).children('div')[1].getAttribute('dragPicTitleBefore'),
                dragPicTitleFont: $('#' + divId).children('div')[1].getAttribute('dragPicTitleFont'),
                dragPicLinkName: $('#' + divId).children('div')[1].getAttribute('dragPicLinkName'),
                dragPicLinkPath: $('#' + divId).children('div')[1].getAttribute('dragPicLinkPath'),
                dragPicLinkStyle: $('#' + divId).children('div')[1].getAttribute('dragPicLinkStyle'),
                dragPicFontSize: $('#' + divId).children('div')[1].getAttribute('dragPicFontSize'),
                dragPicTypes: $('#' + divId).children('div')[1].getAttribute('dragPicTypes'),
            };
            const divAttributes = Object.entries(dragParams)
                .map(([param, value]) => ` ${param}="${value}"`)
                .join("");
            var html = `<li>
                              <div id="draglinepic` + divNum + `" class="draglinepic handle-resize">
                              <div ${divAttributes} style="display:none;" ></div>
                              <div class="card" style="background-color:${dragParams.dragCardColor};">
                              <div class="card-header" style="${dragParams.dragPicTitleFont}">
                              <span class="${dragParams.dragPicTitleBefore}">${dragParams.dragPicTitle}</span>
                              <a href="javascript:void(0);" onclick="dragConst.tabMenu('${dragParams.dragPicLinkPath}', '${dragParams.dragPicTitle}')" style="${dragParams.dragPicLinkStyle}">${dragParams.dragPicLinkName}</a>
                              </div>
                          <div class="card-body"><div id="draglinepic` + divNum + `" class="draglinepic handle-resize" >`;
            dragHttp.postFromAjax(dragParams.dragPicSql, function (data) {
                var json = JSON.parse(data);
                var jsonCount = json.length;
                var option = "";
                let legendDatas = Object.keys(json[0]);
                const values = Object.values(json);
                const keys = $.map(values, (item) => item[legendDatas[0]]);
                legendDatas.shift();
                const datas = legendDatas.map(key => ({
                    name: key,
                    type: "line",
                    data: json.map(item => item[key])
                }));
                if (jsonCount > 0) {
                    option = {
                        textStyle: {
                            fontSize: dragParams.dragPicFontSize
                        },
                        toolbox: {
                            show: true,
                            feature: {
                                mark: { show: true },
                                dataView: { show: true, readOnly: false },
                                restore: { show: true },
                                saveAsImage: { show: true }
                            }
                        },
                        tooltip: {
                            trigger: "axis",
                        },
                        legend: {
                            data: legendDatas,
                        },
                        xAxis: {
                            type: "category",
                            boundaryGap: false,
                            data: keys,
                        },
                        yAxis: {
                            type: "value",
                        },
                        series: datas,
                    };
                }
                html += `
          </div></div></div>
          </li>`;
                gridster.add_widget(html, data_sizex, data_sizey, data_col, data_row);
                var mydiv = $("#draglinepic" + divNum).children("div").children("div")[1];
                var myChart = echarts.init(mydiv);
                myChart.setOption(option);
                mydiv.setAttribute("myChart_id", myChart.id);
            });
        }
    },
    editDiv: function (divId) {
        var tagClass = $('#' + divId).attr('class').split(" ")[0];
        if (tagClass == "title") {//编辑显示
            $("#inputtitleId").val(divId);
            $("#inputTitle").val($('#' + divId).text().trim());
            const bodyStyle = $("#dragBody").attr("style");
            const bodyBG = bodyStyle.split(":")[1].trim().replace(";", "");
            $("#inputBodyBG").val(bodyBG);
            $("#inputBodyBG").parent().children("span").css("background", bodyBG);
            const TitleStyle = $('#' + divId).attr("newstyle");
            const strTitleStyle = TitleStyle.split(";");
            const TitleSize = strTitleStyle[0].split(":")[1].replace("px", "").trim();
            $("#inputTitleSize").val(TitleSize);
            const TitleColor = strTitleStyle[1].split(":")[1].trim();
            $("#inputTitleColor").val(TitleColor);
            $("#inputTitleColor").parent().children("span").css("background", TitleColor);
            const TitleDisplay = strTitleStyle[2].split(":")[1].trim();
            $("#inputTitleDisplay").val(TitleDisplay);
            const TitleAlign = strTitleStyle[3].split(":")[1].trim();
            $("#inputTitleAlign").val(TitleAlign);
            const TitlePadding = strTitleStyle[4].split(":")[1].replace("px", "").trim();
            $("#inputTitlePadding").val(TitlePadding);
            $('#dragtitleSet').modal('show');
        }
        if (tagClass == "draglabel") {
            $("#inputDraglabelId").val(divId);
            $("#inputDraglabelSql").val($('#' + divId).children('div')[1].getAttribute('draglabelSql'));
            $("#inputDraglabelTitle").val($('#' + divId).children('div')[1].getAttribute('draglabelTitle'));
            $("#inputDraglabelTitleFont").val($('#' + divId).children('div')[1].getAttribute('draglabelTitleFont'));
            $("#inputDraglabelCTitleFont").val($('#' + divId).children('div')[1].getAttribute('draglabelCTitleFont'));
            $("#inputDraglabelCCountFont").val($('#' + divId).children('div')[1].getAttribute('draglabelCCountFont'));
            $("#inputDraglabelCLinkFont").val($('#' + divId).children('div')[1].getAttribute('draglabelCLinkFont'));
            $('#draglabelSet').modal('show');
        }
        if (tagClass == "dragonelabel") {
            $("#inputDragonelabelId").val(divId);
            $("#inputDragonelabelSql").val($('#' + divId).children('div')[1].getAttribute('draglabelSql'));
            const draglabelTitleFont = $('#' + divId).children('div')[1].getAttribute('draglabelTitleFont');
            const strsTitleFont = draglabelTitleFont.split(";");
            const draglabelTitleSize = strsTitleFont[0].split(":")[1].replace("px", "").trim();
            const draglabelTitleColor = strsTitleFont[1].split(":")[1].trim();
            $("#inputDragonelabelTitleSize").val(draglabelTitleSize);
            $("#inputDragonelabelTitleColor").val(draglabelTitleColor);
            $("#inputDragonelabelTitleColor").parent().children("span").css("background", draglabelTitleColor);

            const draglabelCountFont = $('#' + divId).children('div')[1].getAttribute('draglabelCountFont');
            const strsCountFont = draglabelCountFont.split(";");
            const draglabelCountSize = strsCountFont[0].split(":")[1].replace("px", "").trim();
            const draglabelCountColor = strsCountFont[1].split(":")[1].trim();
            $("#inputDragonelabelCountSize").val(draglabelCountSize);
            $("#inputDragonelabelCountColor").val(draglabelCountColor);
            $("#inputDragonelabelCountColor").parent().children("span").css("background", draglabelCountColor);

            $("#inputDragonelabelLink").val($('#' + divId).children('div')[1].getAttribute('draglabelLink'));
            $("#inputDragonelabelLinkTitle").val($('#' + divId).children('div')[1].getAttribute('draglabelLinkTitle'));
            const draglabelLinkFont = $('#' + divId).children('div')[1].getAttribute('draglabelLinkFont');
            const strsLinkFont = draglabelLinkFont.split(";");
            const draglabelLinkSize = strsLinkFont[0].split(":")[1].replace("px", "").trim();
            const draglabelLinkColor = strsLinkFont[1].split(":")[1].trim();
            const draglabelLinkShow = strsLinkFont[2].split(":")[1].trim();
            $("#inputDragonelabelLinkSize").val(draglabelLinkSize);
            $("#inputDragonelabelLinkColor").val(draglabelLinkColor);
            $("#inputDragonelabelLinkColor").parent().children("span").css("background", draglabelLinkColor);
            $("#inputDragonelabelLinkDisplay").val(draglabelLinkShow);

            $("#inputDragonelabelImage").val($('#' + divId).children('div')[1].getAttribute('draglabelImage'));
            $("#inputDragonelabelBG").val($('#' + divId).children('div')[1].getAttribute('draglabelBG'));
            $("#inputDragonelabelTime").val($('#' + divId).children('div')[1].getAttribute('draglabelTime'));
            const draglabelImageStyle = $('#' + divId).children('div')[1].getAttribute('draglabelImageStyle');
            const strs = draglabelImageStyle.split(";");
            const draglabelImageSize = strs[0].split(":")[1].replace("px", "").trim();
            const draglabelImageColor = strs[1].split(":")[1].trim();
            $("#inputDragonelabelImageSize").val(draglabelImageSize);
            $("#inputDragonelabelImageColor").val(draglabelImageColor);
            $("#inputDragonelabelImageColor").parent().children("span").css("background", draglabelImageColor);
            $('#dragonelabelSet').modal('show');
            //inputDragonelabelSqlInstance.setValue($('#' + divId).children('div')[1].getAttribute('draglabelSql'));
            //inputDragonelabelSqlInstance.refresh();
        }
        if (tagClass == "dragcardlabel") {
            $("#inputDragcardlabelId").val(divId);
            $("#inputDragcardlabelSql").val($('#' + divId).children('div')[1].getAttribute('draglabelSql'));
            $("#inputDragcardlabelImage").val($('#' + divId).children('div')[1].getAttribute('draglabelImage'));
            $("#inputDragcardlabelBG").val($('#' + divId).children('div')[1].getAttribute('draglabelBG'));
            $("#inputDragcardlabelTime").val($('#' + divId).children('div')[1].getAttribute('draglabelTime'));
            const dragCardColor = $('#' + divId).children('div')[1].getAttribute('dragCardColor');
            $("#inputDragcardlabelCardColor").val(dragCardColor);
            $("#inputDragcardlabelCardColor").parent().children("span").css("background", dragCardColor);

            const draglabelImageStyle = $('#' + divId).children('div')[1].getAttribute('draglabelImageStyle');
            const strs = draglabelImageStyle.split(";");
            const draglabelImageSize = strs[0].split(":")[1].replace("px", "").trim();
            const draglabelImageColor = strs[1].split(":")[1].trim();
            $("#inputDragcardlabelImageSize").val(draglabelImageSize);
            $("#inputDragcardlabelImageColor").val(draglabelImageColor);
            $("#inputDragcardlabelImageColor").parent().children("span").css("background", draglabelImageColor);

            const draglabelTitleStyle = $('#' + divId).children('div')[1].getAttribute('draglabelTitleFont');
            const strs2 = draglabelTitleStyle.split(";");
            const draglabelTitleSize = strs2[0].split(":")[1].replace("px!important", "").trim();
            const draglabelTitleColor = strs2[1].split(":")[1].replace("!important", "").trim();
            $("#inputDragcardlabelTitleSize").val(draglabelTitleSize);
            $("#inputDragcardlabelTitleColor").val(draglabelTitleColor);
            $("#inputDragcardlabelTitleColor").parent().children("span").css("background", draglabelTitleColor);

            const draglabelCountStyle = $('#' + divId).children('div')[1].getAttribute('draglabelCountFont');
            const strs3 = draglabelCountStyle.split(";");
            const draglabelCountSize = strs3[0].split(":")[1].replace("px", "").trim();
            const draglabelCountColor = strs3[1].split(":")[1].trim();
            $("#inputDragcardlabelCountSize").val(draglabelCountSize);
            $("#inputDragcardlabelCountColor").val(draglabelCountColor);
            $("#inputDragcardlabelCountColor").parent().children("span").css("background", draglabelCountColor);

            const draglabelTitle2Style = $('#' + divId).children('div')[1].getAttribute('draglabelTitle2Font');
            const strs4 = draglabelTitle2Style.split(";");
            const draglabelTitle2Size = strs4[0].split(":")[1].replace("px!important", "").trim();
            const draglabelTitle2Color = strs4[1].split(":")[1].replace("!important", "").trim();
            $("#inputDragcardlabelTitle2Size").val(draglabelTitle2Size);
            $("#inputDragcardlabelTitle2Color").val(draglabelTitle2Color);
            $("#inputDragcardlabelTitle2Color").parent().children("span").css("background", draglabelTitle2Color);


            const draglabelCount2Style = $('#' + divId).children('div')[1].getAttribute('draglabelCount2Font');
            const strs5 = draglabelCount2Style.split(";");
            const draglabelCount2Size = strs5[0].split(":")[1].replace("px!important", "").trim();
            const draglabelCount2Color = strs5[1].split(":")[1].replace("!important", "").trim();
            $("#inputDragcardlabelCount2Size").val(draglabelCount2Size);
            $("#inputDragcardlabelCount2Color").val(draglabelCount2Color);
            $("#inputDragcardlabelCount2Color").parent().children("span").css("background", draglabelCount2Color);


            $('#dragcardlabelSet').modal('show');
        }
        if (tagClass == "draglink") {
            $("#inputDraglinkId").val(divId);
            $("#inputDraglinkImage").val($('#' + divId).children('div')[1].getAttribute('dragLinkImage'));
            $("#inputDraglinkBG").val($('#' + divId).children('div')[1].getAttribute('draglinkBG'));
            $("#inputDraglink").val($('#' + divId).children('div')[1].getAttribute('dragLink'));
            $("#inputDraglinkTitle").val($('#' + divId).children('div')[1].getAttribute('draglinkTitle'));
            const draglinkTitleFont = $('#' + divId).children('div')[1].getAttribute('draglinkTitleFont');
            const strs3 = draglinkTitleFont.split(";");
            const draglinkTitleSize = strs3[0].split(":")[1].replace("px", "").trim();
            $("#inputDraglinkTitleSize").val(draglinkTitleSize);
            const draglinkTitleColor = strs3[1].split(":")[1].trim();
            $("#inputDraglinkTitleColor").val(draglinkTitleColor);
            $("#inputDraglinkTitleColor").parent().children("span").css("background", draglinkTitleColor);
            const draglinkStyle = $('#' + divId).children('div')[1].getAttribute('draglinkStyle');
            const strs2 = draglinkStyle.split(";");
            const draglinkSize = strs2[0].split(":")[1].replace("px", "").trim();
            $("#inputDraglinkSize").val(draglinkSize);
            const draglinkColor = strs2[1].split(":")[1].trim();
            $("#inputDraglinkColor").val(draglinkColor);
            $("#inputDraglinkColor").parent().children("span").css("background", draglinkColor);
            $("#inputDraglinkLabel").val($('#' + divId).children('div')[1].getAttribute('draglinkLabel'));
            const draglinkImageStyle = $('#' + divId).children('div')[1].getAttribute('draglinkImageStyle');
            const strs = draglinkImageStyle.split(";");
            const draglinkImageSize = strs[0].split(":")[1].replace("px", "").trim();
            const draglinkImageColor = strs[1].split(":")[1].trim();
            $("#inputDraglinkImageSize").val(draglinkImageSize);
            $("#inputDraglinkImageColor").val(draglinkImageColor);
            $("#inputDraglinkImageColor").parent().children("span").css("background", draglinkImageColor);
            $('#draglinkSet').modal('show');
        }
        if (tagClass == "dragcardlink") {
            $("#inputDragcardlinkId").val(divId);
            $("#inputDragcardlinkImage").val($('#' + divId).children('div')[1].getAttribute('dragLinkImage'));
            const draglinkImageStyle = $('#' + divId).children('div')[1].getAttribute('draglinkImageStyle');
            const strs = draglinkImageStyle.split(";");
            const draglinkImageSize = strs[0].split(":")[1].replace("px", "").trim();
            $("#inputDragcardlinkImageSize").val(draglinkImageSize);
            const draglinkImageColor = strs[1].split(":")[1].trim();
            $("#inputDragcardlinkImageColor").val(draglinkImageColor);
            $("#inputDragcardlinkImageColor").parent().children("span").css("background", draglinkImageColor);
            const draglinkImageDisplay = strs[2].split(":")[1].trim();
            $("#inputDragcardlinkImageDisplay").val(draglinkImageDisplay);
            $("#inputDragcardlink").val($('#' + divId).children('div')[1].getAttribute('dragLink'));
            $("#inputDragcardlinkTitle").val($('#' + divId).children('div')[1].getAttribute('draglinkTitle'));
            const draglinkTitleFont = $('#' + divId).children('div')[1].getAttribute('draglinkTitleFont');
            const strs2 = draglinkTitleFont.split(";");
            const draglinkTitleSize = strs2[0].split(":")[1].replace("pt", "").trim();
            $("#inputDragcardlinkTitleSize").val(draglinkTitleSize);
            const draglinkTitleColor = strs2[1].split(":")[1].trim();
            $("#inputDragcardlinkTitleColor").val(draglinkTitleColor);
            $("#inputDragcardlinkTitleColor").parent().children("span").css("background", draglinkTitleColor);
            const dragCardColor = $('#' + divId).children('div')[1].getAttribute('dragCardColor');
            $("#inputDragcardlinkCardColor").val(dragCardColor);
            $("#inputDragcardlinkCardColor").parent().children("span").css("background", dragCardColor);
            $('#dragcardlinkSet').modal('show');
        }
        if (tagClass == "dragtable") {
            $("#inputDragtableId").val(divId);
            $("#inputDragtableSql").val($('#' + divId).children('div')[1].getAttribute('dragtableSql'));
            $("#inputDragtableTitle").val($('#' + divId).children('div')[1].getAttribute('dragtableTitle'));
            $("#inputDragtableTitleBefore").val($('#' + divId).children('div')[1].getAttribute('dragtableTitleBefore'));
            const dragtableTitleFont = $('#' + divId).children('div')[1].getAttribute('dragtableTitleFont');
            const strs = dragtableTitleFont.split(";");
            const dragtableTitleSize = strs[0].split(":")[1].replace("px", "").trim();
            $("#inputDragtableTitleSize").val(dragtableTitleSize);
            const dragtableTitleColor = strs[1].split(":")[1].trim();
            $("#inputDragtableTitleColor").val(dragtableTitleColor);
            $("#inputDragtableTitleColor").parent().children("span").css("background", dragtableTitleColor);
            const dragtableTitleDisplay = strs[2].split(":")[1].trim();
            $("#inputDragtableTitleDisplay").val(dragtableTitleDisplay);
            const dragtableTitleAlign = strs[3].split(":")[1].trim();
            $("#inputDragtableTitleAlign").val(dragtableTitleAlign);
            $("#inputDragtableTime").val($('#' + divId).children('div')[1].getAttribute('dragtableTime'));
            const dragCardColor = $('#' + divId).children('div')[1].getAttribute('dragCardColor');
            $("#inputDragtableCardColor").val(dragCardColor);
            $("#inputDragtableCardColor").parent().children("span").css("background", dragCardColor);

            $("#inputDragtableType").val($('#' + divId).children('div')[1].getAttribute('dragtableType'));
            $("#inputDragtableLinkName").val($('#' + divId).children('div')[1].getAttribute('dragtableLinkName'));
            $("#inputDragtableLinkPath").val($('#' + divId).children('div')[1].getAttribute('dragtableLinkPath'));
            const dragtableLinkStyle = $('#' + divId).children('div')[1].getAttribute('dragtableLinkStyle');
            const strLinkStyle = dragtableLinkStyle.split(";");
            const dragtableLinkSize = strLinkStyle[0].split(":")[1].replace("px", "").trim();
            $("#inputDragtableLinkSize").val(dragtableLinkSize);
            const dragtableLinkColor = strLinkStyle[1].split(":")[1].trim();
            $("#inputDragtableLinkColor").val(dragtableLinkColor);
            $("#inputDragtableLinkColor").parent().children("span").css("background", dragtableLinkColor);
            const dragtableLinkDisplay = strLinkStyle[2].split(":")[1].trim();
            $("#inputDragtableLinkDisplay").val(dragtableLinkDisplay);
            const dragtableLinkFloat = strLinkStyle[3].split(":")[1].trim();
            $("#inputDragtableLinkFloat").val(dragtableLinkFloat);

            const dragtableTheadStyle = $('#' + divId).children('div')[1].getAttribute('dragtableTheadStyle');
            const strTheadStyle = dragtableTheadStyle.split(";");
            const dragtableTheadSize = strTheadStyle[0].split(":")[1].replace("px", "").trim();
            $("#inputDragtableTheadSize").val(dragtableTheadSize);
            const dragtableTheadColor = strTheadStyle[1].split(":")[1].trim();
            $("#inputDragtableTheadColor").val(dragtableTheadColor);
            $("#inputDragtableTheadColor").parent().children("span").css("background", dragtableTheadColor);
            const dragtableTheadDisplay = strTheadStyle[2].split(":")[1].trim();
            $("#inputDragtableTheadDisplay").val(dragtableTheadDisplay);
            const dragtableTheadAlign = strTheadStyle[3].split(":")[1].trim();
            $("#inputDragtableTheadAlign").val(dragtableTheadAlign);
            const dragtableTheadPadding = strTheadStyle[4].split(":")[1].replace("px", "").trim();
            $("#inputDragtableTheadPadding").val(dragtableTheadPadding);

            const dragtableTbodyStyle = $('#' + divId).children('div')[1].getAttribute('dragtableTbodyStyle');
            const strTbodyStyle = dragtableTbodyStyle.split(";");
            const dragtableTbodySize = strTbodyStyle[0].split(":")[1].replace("px", "").trim();
            $("#inputDragtableTbodySize").val(dragtableTbodySize);
            const dragtableTbodyColor = strTbodyStyle[1].split(":")[1].trim();
            $("#inputDragtableTbodyColor").val(dragtableTbodyColor);
            $("#inputDragtableTbodyColor").parent().children("span").css("background", dragtableTbodyColor);
            const dragtableTbodyDisplay = strTbodyStyle[2].split(":")[1].trim();
            $("#inputDragtableTbodyDisplay").val(dragtableTbodyDisplay);
            const dragtableTbodyAlign = strTbodyStyle[3].split(":")[1].trim();
            $("#inputDragtableTbodyAlign").val(dragtableTbodyAlign);
            const dragtableTbodyPadding = strTbodyStyle[4].split(":")[1].replace("px", "").trim();
            $("#inputDragtableTbodyPadding").val(dragtableTbodyPadding);

            $('#dragtableSet').modal('show');
        }
        if (tagClass == "draggaugepic") {
            $("#inputDraggaugeId").val(divId);
            $("#inputDraggaugeSql").val($('#' + divId).children('div')[1].getAttribute('dragPicSql'));
            $("#inputDraggaugeTitle").val($('#' + divId).children('div')[1].getAttribute('dragPicTitle'));
            $("#inputDraggaugeTime").val($('#' + divId).children('div')[1].getAttribute('dragPicTime'));
            const dragCardColor = $('#' + divId).children('div')[1].getAttribute('dragCardColor');
            $("#inputDraggaugeCardColor").val(dragCardColor);
            $("#inputDraggaugeCardColor").parent().children("span").css("background", dragCardColor);
            $("#inputDraggaugeTitleBefore").val($('#' + divId).children('div')[1].getAttribute('dragPicTitleBefore'));
            const draggaugeTitleFont = $('#' + divId).children('div')[1].getAttribute('dragPicTitleFont');
            const strs = draggaugeTitleFont.split(";");
            const draggaugeTitleSize = strs[0].split(":")[1].replace("px", "").trim();
            $("#inputDraggaugeTitleSize").val(draggaugeTitleSize);
            const draggaugeTitleColor = strs[1].split(":")[1].trim();
            $("#inputDraggaugeTitleColor").val(draggaugeTitleColor);
            $("#inputDraggaugeTitleColor").parent().children("span").css("background", draggaugeTitleColor);
            const draggaugeTitleDisplay = strs[2].split(":")[1].trim();
            $("#inputDraggaugeTitleDisplay").val(draggaugeTitleDisplay);
            const draggaugeTitleAlign = strs[3].split(":")[1].trim();
            $("#inputDraggaugeTitleAlign").val(draggaugeTitleAlign);
            $("#inputDraggaugeLinkName").val($('#' + divId).children('div')[1].getAttribute('dragPicLinkName'));
            $("#inputDraggaugeLinkPath").val($('#' + divId).children('div')[1].getAttribute('dragPicLinkPath'));
            const draggaugeLinkStyle = $('#' + divId).children('div')[1].getAttribute('dragPicLinkStyle');
            const strLinkStyle = draggaugeLinkStyle.split(";");
            const draggaugeLinkSize = strLinkStyle[0].split(":")[1].replace("px", "").trim();
            $("#inputDraggaugeLinkSize").val(draggaugeLinkSize);
            const draggaugeLinkColor = strLinkStyle[1].split(":")[1].trim();
            $("#inputDraggaugeLinkColor").val(draggaugeLinkColor);
            $("#inputDraggaugeLinkColor").parent().children("span").css("background", draggaugeLinkColor);
            const draggaugeLinkDisplay = strLinkStyle[2].split(":")[1].trim();
            $("#inputDraggaugeLinkDisplay").val(draggaugeLinkDisplay);
            const draggaugeLinkFloat = strLinkStyle[3].split(":")[1].trim();
            $("#inputDraggaugeLinkFloat").val(draggaugeLinkFloat);
            $("#inputDraggaugeFontSize").val($('#' + divId).children('div')[1].getAttribute('dragPicFontSize'));
            $('#draggaugeSet').modal('show');
        }
        if (tagClass == "dragpiepic") {
            $("#inputDragpieId").val(divId);
            $("#inputDragpieSql").val($('#' + divId).children('div')[1].getAttribute('dragPicSql'));
            $("#inputDragpieTitle").val($('#' + divId).children('div')[1].getAttribute('dragPicTitle'));
            $("#inputDragpieTime").val($('#' + divId).children('div')[1].getAttribute('dragPicTime'));
            const dragCardColor = $('#' + divId).children('div')[1].getAttribute('dragCardColor');
            $("#inputDragpieCardColor").val(dragCardColor);
            $("#inputDragpieCardColor").parent().children("span").css("background", dragCardColor);
            $("#inputDragpieTitleBefore").val($('#' + divId).children('div')[1].getAttribute('dragPicTitleBefore'));
            const dragpieTitleFont = $('#' + divId).children('div')[1].getAttribute('dragPicTitleFont');
            const strs = dragpieTitleFont.split(";");
            const dragpieTitleSize = strs[0].split(":")[1].replace("px", "").trim();
            $("#inputDragpieTitleSize").val(dragpieTitleSize);
            const dragpieTitleColor = strs[1].split(":")[1].trim();
            $("#inputDragpieTitleColor").val(dragpieTitleColor);
            $("#inputDragpieTitleColor").parent().children("span").css("background", dragpieTitleColor);
            const dragpieTitleDisplay = strs[2].split(":")[1].trim();
            $("#inputDragpieTitleDisplay").val(dragpieTitleDisplay);
            const dragpieTitleAlign = strs[3].split(":")[1].trim();
            $("#inputDragpieTitleAlign").val(dragpieTitleAlign);
            $("#inputDragpieLinkName").val($('#' + divId).children('div')[1].getAttribute('dragPicLinkName'));
            $("#inputDragpieLinkPath").val($('#' + divId).children('div')[1].getAttribute('dragPicLinkPath'));
            const dragpieLinkStyle = $('#' + divId).children('div')[1].getAttribute('dragPicLinkStyle');
            const strLinkStyle = dragpieLinkStyle.split(";");
            const dragpieLinkSize = strLinkStyle[0].split(":")[1].replace("px", "").trim();
            $("#inputDragpieLinkSize").val(dragpieLinkSize);
            const dragpieLinkColor = strLinkStyle[1].split(":")[1].trim();
            $("#inputDragpieLinkColor").val(dragpieLinkColor);
            $("#inputDragpieLinkColor").parent().children("span").css("background", dragpieLinkColor);
            const dragpieLinkDisplay = strLinkStyle[2].split(":")[1].trim();
            $("#inputDragpieLinkDisplay").val(dragpieLinkDisplay);
            const dragpieLinkFloat = strLinkStyle[3].split(":")[1].trim();
            $("#inputDragpieLinkFloat").val(dragpieLinkFloat);
            $("#inputDragpieFontSize").val($('#' + divId).children('div')[1].getAttribute('dragPicFontSize'));
            $('#dragpieSet').modal('show');
        }
        if (tagClass == "dragbarpic") {
            $("#inputDragbarId").val(divId);
            $("#inputDragbarSql").val($('#' + divId).children('div')[1].getAttribute('dragPicSql'));
            $("#inputDragbarTitle").val($('#' + divId).children('div')[1].getAttribute('dragPicTitle'));
            $("#inputDragbarTime").val($('#' + divId).children('div')[1].getAttribute('dragPicTime'));
            const dragCardColor = $('#' + divId).children('div')[1].getAttribute('dragCardColor');
            $("#inputDragbarCardColor").val(dragCardColor);
            $("#inputDragbarCardColor").parent().children("span").css("background", dragCardColor);
            $("#inputDragbarTitleBefore").val($('#' + divId).children('div')[1].getAttribute('dragPicTitleBefore'));
            const dragbarTitleFont = $('#' + divId).children('div')[1].getAttribute('dragPicTitleFont');
            const strs = dragbarTitleFont.split(";");
            const dragbarTitleSize = strs[0].split(":")[1].replace("px", "").trim();
            $("#inputDragbarTitleSize").val(dragbarTitleSize);
            const dragbarTitleColor = strs[1].split(":")[1].trim();
            $("#inputDragbarTitleColor").val(dragbarTitleColor);
            $("#inputDragbarTitleColor").parent().children("span").css("background", dragbarTitleColor);
            const dragbarTitleDisplay = strs[2].split(":")[1].trim();
            $("#inputDragbarTitleDisplay").val(dragbarTitleDisplay);
            const dragbarTitleAlign = strs[3].split(":")[1].trim();
            $("#inputDragbarTitleAlign").val(dragbarTitleAlign);
            $("#inputDragbarLinkName").val($('#' + divId).children('div')[1].getAttribute('dragPicLinkName'));
            $("#inputDragbarLinkPath").val($('#' + divId).children('div')[1].getAttribute('dragPicLinkPath'));
            const dragbarLinkStyle = $('#' + divId).children('div')[1].getAttribute('dragPicLinkStyle');
            const strLinkStyle = dragbarLinkStyle.split(";");
            const dragbarLinkSize = strLinkStyle[0].split(":")[1].replace("px", "").trim();
            $("#inputDragbarLinkSize").val(dragbarLinkSize);
            const dragbarLinkColor = strLinkStyle[1].split(":")[1].trim();
            $("#inputDragbarLinkColor").val(dragbarLinkColor);
            $("#inputDragbarLinkColor").parent().children("span").css("background", dragbarLinkColor);
            const dragbarLinkDisplay = strLinkStyle[2].split(":")[1].trim();
            $("#inputDragbarLinkDisplay").val(dragbarLinkDisplay);
            const dragbarLinkFloat = strLinkStyle[3].split(":")[1].trim();
            $("#inputDragbarLinkFloat").val(dragbarLinkFloat);
            $("#inputDragbarFontSize").val($('#' + divId).children('div')[1].getAttribute('dragPicFontSize'));
            $("#inputDragbarTypes").val($('#' + divId).children('div')[1].getAttribute('dragPicTypes'));
            $('#dragbarSet').modal('show');
        }
        if (tagClass == "draglinepic") {
            $("#inputDraglineId").val(divId);
            $("#inputDraglineSql").val($('#' + divId).children('div')[1].getAttribute('dragPicSql'));
            $("#inputDraglineTitle").val($('#' + divId).children('div')[1].getAttribute('dragPicTitle'));
            $("#inputDraglineTime").val($('#' + divId).children('div')[1].getAttribute('dragPicTime'));
            const dragCardColor = $('#' + divId).children('div')[1].getAttribute('dragCardColor');
            $("#inputDraglineCardColor").val(dragCardColor);
            $("#inputDraglineCardColor").parent().children("span").css("background", dragCardColor);
            $("#inputDraglineTitleBefore").val($('#' + divId).children('div')[1].getAttribute('dragPicTitleBefore'));
            const draglineTitleFont = $('#' + divId).children('div')[1].getAttribute('dragPicTitleFont');
            const strs = draglineTitleFont.split(";");
            const draglineTitleSize = strs[0].split(":")[1].replace("px", "").trim();
            $("#inputDraglineTitleSize").val(draglineTitleSize);
            const draglineTitleColor = strs[1].split(":")[1].trim();
            $("#inputDraglineTitleColor").val(draglineTitleColor);
            $("#inputDraglineTitleColor").parent().children("span").css("background", draglineTitleColor);
            const draglineTitleDisplay = strs[2].split(":")[1].trim();
            $("#inputDraglineTitleDisplay").val(draglineTitleDisplay);
            const draglineTitleAlign = strs[3].split(":")[1].trim();
            $("#inputDraglineTitleAlign").val(draglineTitleAlign);
            $("#inputDraglineLinkName").val($('#' + divId).children('div')[1].getAttribute('dragPicLinkName'));
            $("#inputDraglineLinkPath").val($('#' + divId).children('div')[1].getAttribute('dragPicLinkPath'));
            const draglineLinkStyle = $('#' + divId).children('div')[1].getAttribute('dragPicLinkStyle');
            const strLinkStyle = draglineLinkStyle.split(";");
            const draglineLinkSize = strLinkStyle[0].split(":")[1].replace("px", "").trim();
            $("#inputDraglineLinkSize").val(draglineLinkSize);
            const draglineLinkColor = strLinkStyle[1].split(":")[1].trim();
            $("#inputDraglineLinkColor").val(draglineLinkColor);
            $("#inputDraglineLinkColor").parent().children("span").css("background", draglineLinkColor);
            const draglineLinkDisplay = strLinkStyle[2].split(":")[1].trim();
            $("#inputDraglineLinkDisplay").val(draglineLinkDisplay);
            const draglineLinkFloat = strLinkStyle[3].split(":")[1].trim();
            $("#inputDraglineLinkFloat").val(draglineLinkFloat);
            $("#inputDraglineFontSize").val($('#' + divId).children('div')[1].getAttribute('dragPicFontSize'));
            $("#inputDraglineTypes").val($('#' + divId).children('div')[1].getAttribute('dragPicTypes'));
            $('#draglineSet').modal('show');
        }
    },
    editSaveDiv: function (inputId) {
        var divId = $("#" + inputId).val();
        var tagClass = $('#' + divId).attr('class').split(" ")[0];
        if (tagClass == "title") {//保存  
            $('#' + divId).text($("#inputTitle").val());
            const bodyBG = $("#inputBodyBG").val();
            $("#dragBody").attr("style", `background:${bodyBG};`);
            const TitleSize = $("#inputTitleSize").val();
            const TitleColor = $("#inputTitleColor").val();
            const TitleDisplay = $("#inputTitleDisplay").val();
            const TitleAlign = $("#inputTitleAlign").val();
            const TitlePadding = $("#inputTitlePadding").val();
            const TitleStyle = `font-size:${TitleSize}px;color:${TitleColor};display:${TitleDisplay};text-align:${TitleAlign};padding:${TitlePadding}px;`;
            $('#' + divId).attr("style", TitleStyle);
            $('#' + divId).attr("newstyle", TitleStyle);
            $('#' + divId).css("display", "block");
            $('#dragtitleSet').modal('hide');
        }
        if (tagClass == "dragonelabel") {
            divCount = $('#' + divId).children('div').length;
            //设置整个保存项
            const draglabelTitleSize = $("#inputDragonelabelTitleSize").val();
            const draglabelTitleColor = $("#inputDragonelabelTitleColor").val();
            const draglabelTitleFont = `font-size:${draglabelTitleSize}px;color:${draglabelTitleColor};`;
            const draglabelCountSize = $("#inputDragonelabelCountSize").val();
            const draglabelCountColor = $("#inputDragonelabelCountColor").val();
            const draglabelCountFont = `font-size:${draglabelCountSize}px;color:${draglabelCountColor};`;
            const draglabelLink = $("#inputDragonelabelLink").val();
            const draglabelLinkTitle = $("#inputDragonelabelLinkTitle").val();
            const draglabelLinkSize = $("#inputDragonelabelLinkSize").val();
            const draglabelLinkColor = $("#inputDragonelabelLinkColor").val();
            const draglabelLinkDisplay = $("#inputDragonelabelLinkDisplay").val();
            const draglabelLinkFloat = $("#inputDragonelabelLinkFloat").val();
            const draglabelLinkFont = `font-size:${draglabelLinkSize}px;color:${draglabelLinkColor};display:${draglabelLinkDisplay};float:${draglabelLinkFloat};`;
            const draglabelSql = inputDragonelabelSqlInstance.getValue();//$("#inputDragonelabelSql").val();
            const draglabelImage = $("#inputDragonelabelImage").val();
            const draglabelBG = $("#inputDragonelabelBG").val();
            const draglabelTime = $("#inputDragonelabelTime").val();
            const draglabelImageSize = $("#inputDragonelabelImageSize").val();
            const draglabelImageColor = $("#inputDragonelabelImageColor").val();
            const draglabelImageStyle = `font-size:${draglabelImageSize}px;color:${draglabelImageColor};`;
            // 获取目标HTML元素
            var targetElement = $('#' + divId).children('div')[0];
            // 设置属性
            const attributesToUpdate = {
                'draglabelSql': draglabelSql,
                'draglabelTitleFont': draglabelTitleFont,
                'draglabelCountFont': draglabelCountFont,
                'draglabelLink': draglabelLink,
                'draglabelLinkTitle': draglabelLinkTitle,
                'draglabelLinkFont': draglabelLinkFont,
                'draglabelImage': draglabelImage,
                'draglabelBG': draglabelBG,
                'draglabelTime': draglabelTime,
                'draglabelImageStyle': draglabelImageStyle,
            };
            dragUpdateAttr.updateElementAttributes(targetElement, attributesToUpdate);
            var getclass = $('#' + divId).attr("class");
            const desiredClass = getclass.match(/\b(bg-\w+(?:-\w+)*)\b/)[1];
            $('#' + divId).attr("class", getclass.replace(desiredClass, draglabelBG));

            var html = "";
            $('#' + divId).children('div')[1].remove();

            dragHttp.postFromAjax(draglabelSql, function (data) {
                var json = JSON.parse(data);
                var jsonCount = json.length;
                var keys = Object.keys(json[0]);
                var values = Object.values(json[0]);
                if (jsonCount > 0) {
                    html += `<div class="inner"><div class="inner-count" style="` + draglabelCountFont + `">` + values[0] + `</div>
              <div class="inner-title" style="`+ draglabelTitleFont + `">` + keys[0] + `</div></div>`;
                    html += `<div class="icon" style="${draglabelImageStyle}">
                      <i class="ion `+ draglabelImage + `"></i>
                  </div>`;
                    html += `<a onclick="dragConst.tabMenu('${draglabelLink}', '${draglabelLinkTitle}')" class="small-box-footer" href="###" style="` + draglabelLinkFont + `">` + draglabelLinkTitle + `<i class="fa fa-arrow-circle-right"></i></a>`;
                    html += `</div>`;
                }
                var tempDiv = document.createElement('div');
                tempDiv.innerHTML = html;
                document.getElementById(divId).appendChild(tempDiv);
                $("#dragonelabelSet").modal("hide");
            });
        }
        if (tagClass == "dragcardlabel") {
            divCount = $('#' + divId).children('div').length;
            const draglabelTitleFont = `font-size: ${$("#inputDragcardlabelTitleSize").val()}px!important;color: ${$("#inputDragcardlabelTitleColor").val()}!important;`;
            const draglabelCountFont = `font-size: ${$("#inputDragcardlabelCountSize").val()}px;color: ${$("#inputDragcardlabelCountColor").val()};`;
            const draglabelTitle2Font = `font-size: ${$("#inputDragcardlabelTitle2Size").val()}px!important;color: ${$("#inputDragcardlabelTitle2Color").val()}!important;`;
            const draglabelCount2Font = `font-size: ${$("#inputDragcardlabelCount2Size").val()}px!important;color: ${$("#inputDragcardlabelCount2Color").val()}!important;`;
            const draglabelSql = inputDragcardlabelSqlInstance.getValue(); //$("#inputDragcardlabelSql").val();
            const draglabelImage = $("#inputDragcardlabelImage").val();
            const draglabelBG = $("#inputDragcardlabelBG").val();
            const draglabelTime = $("#inputDragcardlabelTime").val();
            const dragCardColor = $("#inputDragcardlabelCardColor").val();
            const draglabelImageSize = $("#inputDragcardlabelImageSize").val();
            const draglabelImageColor = $("#inputDragcardlabelImageColor").val();
            const draglabelImageDivSize = draglabelImageSize * 1.25;
            const ImageDivStyle1 = `border-radius:${draglabelImageDivSize}px;width:${draglabelImageDivSize}px;height:${draglabelImageDivSize}px;line-height:${draglabelImageDivSize}px;`;
            const ImageDivStyle2 = `font-size: ${draglabelImageSize}px;`;
            const draglabelImageStyle = `font-size:${draglabelImageSize}px;color:${draglabelImageColor};`;
            // 获取目标HTML元素
            var targetElement = $('#' + divId).children('div')[0];
            // 设置属性
            var attributesToUpdate = {
                'draglabelSql': draglabelSql,
                'draglabelTitleFont': draglabelTitleFont,
                'draglabelCountFont': draglabelCountFont,
                'draglabelTitle2Font': draglabelTitle2Font,
                'draglabelCount2Font': draglabelCount2Font,
                'draglabelImage': draglabelImage,
                'draglabelBG': draglabelBG,
                'draglabelTime': draglabelTime,
                'dragCardColor': dragCardColor,
                'draglabelImageStyle': draglabelImageStyle,
            };
            dragUpdateAttr.updateElementAttributes(targetElement, attributesToUpdate);

            var html = "";
            $('#' + divId).children('div')[1].remove();

            dragHttp.postFromAjax(draglabelSql, function (data) {
                var json = JSON.parse(data);
                var jsonCount = json.length;
                var keys = Object.keys(json[0]);
                var values = Object.values(json[0]);
                if (jsonCount > 0) {
                    html += `<div class="card-body">
                  <div class="row"><div class="col">
                      <h3 style="${attributesToUpdate.draglabelCountFont}" class="mb-2 fw-semibold">${dragConst.addThousandSeparator(values[0])}</h3>
                      <p style="${attributesToUpdate.draglabelTitleFont}" class="text-muted fs-15 mb-0">${keys[0]}</p>`;
                    if (keys.length > 1) {
                        html += `
                      <p style="${attributesToUpdate.draglabelTitle2Font}" class="text-muted mb-0 mt-2 fs-12">
                          <span style="${attributesToUpdate.draglabelCount2Font}" class="icn-box text-success fw-semibold fs-15 me-1">
                              ${dragConst.addThousandSeparator(values[1])}</span>
                              ${keys[1]} </p>`;
                    }
                    html += `
                          </div>
                          <div class="col col-auto top-icn" style="${ImageDivStyle2}">
                              <div class="counter-icon ${attributesToUpdate.draglabelBG} dash ms-auto box-shadow-primary" style="${ImageDivStyle1}">
                                  <i class="ion ${attributesToUpdate.draglabelImage}" style="${attributesToUpdate.draglabelImageStyle}"></i>
                              </div>
                          </div>
                  </div>
                  </div>
               </div>`;
                }
                var tempDiv = document.createElement('div');
                tempDiv.innerHTML = html;
                tempDiv.setAttribute("class", "card");
                tempDiv.setAttribute("style", `background-color:${attributesToUpdate.dragCardColor}`);
                document.getElementById(divId).appendChild(tempDiv);
                $("#dragcardlabelSet").modal("hide");
            });
        }
        if (tagClass == "draglabel") {
            divCount = $('#' + divId).children('div').length;
            //设置整个保存项
            $('#' + divId).children('div')[0].setAttribute('draglabelSql', $("#inputDraglabelSql").val());
            $('#' + divId).children('div')[0].setAttribute('draglabelTitle', $("#inputDraglabelTitle").val());
            $('#' + divId).children('div')[0].setAttribute('draglabelTitleFont', $("#inputDraglabelTitleFont").val());
            $('#' + divId).children('div')[0].setAttribute('draglabelCTitleFont', $("#inputDraglabelCTitleFont").val());
            $('#' + divId).children('div')[0].setAttribute('draglabelCCountFont', $("#inputDraglabelCCountFont").val());
            $('#' + divId).children('div')[0].setAttribute('draglabelCLinkFont', $("#inputDraglabelCLinkFont").val());


            $('#' + divId).children('div')[1].innerHTML = $("#inputDraglabelTitle").val();
            $('#' + divId).children('div')[1].setAttribute('style', $("#inputDraglabelTitleFont").val());
            var html = "";
            // 清除原有div
            if (divCount >= 3) {
                for (x = divCount - 1; x >= 2; x--) {
                    $('#' + divId).children('div')[x].remove();
                }
            }
            // 获取div>3,设置副标题，数量和链接
            dragHttp.postFromAjax($("#inputDraglabelSql").val(), function (data) {
                var json = JSON.parse(data);
                var jsonCount = json.length;
                var keys = Object.keys(json[0]);
                var values = Object.values(json[0]);
                var percentage = 100 / keys.length;
                var urls = "";
                if (jsonCount > 1) {
                    urls = Object.values(json[1]);
                }
                for (var x = 0; x < keys.length; x++) {
                    html += `
              <div style="width: `+ percentage + `%; height: 100%; float: left">
                  <div style="`+ $("#inputDraglabelCTitleFont").val() + `">` + keys[x] + `</div>
                  <div style="`+ $("#inputDraglabelCCountFont").val() + `">` + values[x] + `</div>`
                    if (urls != "" && urls[x] != "" && urls[x] != " ") {
                        html += `<a target="_blank" href="` + urls[x] + `" style="` + $("#inputDraglabelCLinkFont").val() + `">` + keys[x] + `</a>`;
                    }
                    html += `</div>`;
                }
                var tempDiv = document.createElement('div'); // 创建一个新的<div>元素
                tempDiv.innerHTML = html;
                document.getElementById(divId).appendChild(tempDiv);
                $("#draglabelSet").modal("hide");
            });

        }
        if (tagClass == "draglink") {
            const draglinkImage = $("#inputDraglinkImage").val();
            const draglinkBG = $("#inputDraglinkBG").val();
            const draglink = $("#inputDraglink").val();
            const draglinkTitle = $("#inputDraglinkTitle").val();
            const draglinkTitleSize = $("#inputDraglinkTitleSize").val();
            const draglinkTitleColor = $("#inputDraglinkTitleColor").val();
            const draglinkTitleFont = `font-size:${draglinkTitleSize}px;color:${draglinkTitleColor};`;


            const draglinkSize = $("#inputDraglinkSize").val();
            const draglinkColor = $("#inputDraglinkColor").val();
            const draglinkStyle = `font-size:${draglinkSize}px;color:${draglinkColor};`;

            const draglinkLabel = $("#inputDraglinkLabel").val();
            const draglinkImageSize = $("#inputDraglinkImageSize").val();
            const draglinkImageColor = $("#inputDraglinkImageColor").val();
            const draglinkImageStyle = `font-size:${draglinkImageSize}px;color:${draglinkImageColor};`;
            var targetElement = $('#' + divId).children('div')[0];
            const attributesToUpdate = {
                'draglinkImage': draglinkImage,
                'draglinkBG': draglinkBG,
                'draglink': draglink,
                'draglinkTitle': draglinkTitle,
                'draglinkTitleFont': draglinkTitleFont,
                'draglinkStyle': draglinkStyle,
                'draglinkLabel': draglinkLabel,
                'draglinkImageStyle': draglinkImageStyle,
            };

            dragUpdateAttr.updateElementAttributes(targetElement, attributesToUpdate);

            $('#' + divId).children('div')[1].remove();

            var getclass = $('#' + divId).attr("class");
            const desiredClass = getclass.match(/\b(bg-\w+(?:-\w+)*)\b/)[1];
            $('#' + divId).attr("class", getclass.replace(desiredClass, draglinkBG));
            var html = "";
            html += `<div class="inner">
                      <div class="inner-title" style="`+ draglinkTitleFont + `">` + draglinkTitle + `</div>
                  </div>
                  <div class="icon" style="${draglinkImageStyle}">
                      <i class="ion `+ draglinkImage + `"></i>
                  </div>
                  <a onclick="dragConst.tabMenu('${draglink}', '${draglinkTitle}')" href="###" class="small-box-footer" style="` + draglinkStyle + `">` + draglinkLabel + ` <i class="fa fa-arrow-circle-right"></i></a>
              `;
            var tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            //tempDiv.style.height = '100%';
            document.getElementById(divId).appendChild(tempDiv);
            $('#draglinkSet').modal('hide');
        }
        if (tagClass == "dragcardlink") {
            const draglinkImageSize = $("#inputDragcardlinkImageSize").val();
            const draglinkImageColor = $("#inputDragcardlinkImageColor").val();
            const draglinkImageDisplay = $("#inputDragcardlinkImageDisplay").val();
            const draglinkImageStyle = `font-size:${draglinkImageSize}px;color:${draglinkImageColor};display:${draglinkImageDisplay};`;
            const draglinkTitleSize = $("#inputDragcardlinkTitleSize").val();
            const draglinkTitleColor = $("#inputDragcardlinkTitleColor").val();
            const draglinkTitleFont = `font-size:${draglinkTitleSize}pt;color:${draglinkTitleColor};`;
            const dragParams = {
                draglinkImage: $("#inputDragcardlinkImage").val(),
                draglinkImageStyle: draglinkImageStyle,
                draglinkTitle: $("#inputDragcardlinkTitle").val(),
                draglinkTitleFont: draglinkTitleFont,
                draglink: $("#inputDragcardlink").val(),
                dragCardColor: $("#inputDragcardlinkCardColor").val(),
            };
            $('#' + divId).children('div')[0].setAttribute('dragLinkImage', dragParams.draglinkImage);
            $('#' + divId).children('div')[0].setAttribute('draglinkImageStyle', dragParams.draglinkImageStyle);
            $('#' + divId).children('div')[0].setAttribute('dragLink', dragParams.draglink);
            $('#' + divId).children('div')[0].setAttribute('draglinkTitle', dragParams.draglinkTitle);
            $('#' + divId).children('div')[0].setAttribute('draglinkTitleFont', dragParams.draglinkTitleFont);
            $('#' + divId).children('div')[0].setAttribute('draglink', dragParams.draglink);
            $('#' + divId).children('div')[0].setAttribute('dragCardColor', dragParams.dragCardColor);

            $('#' + divId).children('div')[1].remove();

            var html = `
                      <div class="card-body" style="text-align: center;">
                          <a onclick="dragConst.tabMenu('${dragParams.draglink}', '${dragParams.draglinkTitle}')" href="###">
                              <i class="${dragParams.draglinkImage}" style="${dragParams.draglinkImageStyle}"></i>
                              <span style="${dragParams.draglinkTitleFont}">${dragParams.draglinkTitle}</span>
                          </a>
                      </div>
              `;
            var tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            document.getElementById(divId).appendChild(tempDiv);
            tempDiv.setAttribute("class", "card");
            tempDiv.setAttribute("style", `background-color:${dragParams.dragCardColor};`);
            $('#dragcardlinkSet').modal('hide');
        }
        if (tagClass == "dragtable") {
            var dragtableTitle = $("#inputDragtableTitle").val();
            const dragtableTitleSize = $("#inputDragtableTitleSize").val();
            const dragtableTitleColor = $("#inputDragtableTitleColor").val();
            const dragtableTitleDisplay = $("#inputDragtableTitleDisplay").val();
            const dragtableTitleAlign = $("#inputDragtableTitleAlign").val();
            const dragtableTitleFont = `font-size:${dragtableTitleSize}px;color:${dragtableTitleColor};display:${dragtableTitleDisplay};text-align:${dragtableTitleAlign};`;
            const dragtableTitleBefore = $("#inputDragtableTitleBefore").val();
            const dragtableSql = inputDragtableSqlInstance.getValue(); //$("#inputDragtableSql").val();
            const dragtableTime = $("#inputDragtableTime").val();
            const dragCardColor = $("#inputDragtableCardColor").val();
            const dragtableType = $("#inputDragtableType").val();
            const dragtableLinkName = $("#inputDragtableLinkName").val();
            const dragtableLinkPath = $("#inputDragtableLinkPath").val();
            const dragtableLinkSize = $("#inputDragtableLinkSize").val();
            const dragtableLinkColor = $("#inputDragtableLinkColor").val();
            const dragtableLinkFloat = $("#inputDragtableLinkFloat").val();
            const dragtableLinkStyle = `font-size:${dragtableLinkSize}px;color:${dragtableLinkColor};display:block;float:${dragtableLinkFloat};`;
            const dragtableTheadSize = $("#inputDragtableTheadSize").val();
            const dragtableTheadColor = $("#inputDragtableTheadColor").val();
            const dragtableTheadAlign = $("#inputDragtableTheadAlign").val();
            const dragtableTheadPadding = $("#inputDragtableTheadPadding").val();
            const dragtableTheadStyle = `font-size:${dragtableTheadSize}px;color:${dragtableTheadColor};display:table-cell;text-align:${dragtableTheadAlign};padding:${dragtableTheadPadding}px;`;
            const dragtableTbodySize = $("#inputDragtableTbodySize").val();
            const dragtableTbodyColor = $("#inputDragtableTbodyColor").val();
            const dragtableTbodyAlign = $("#inputDragtableTbodyAlign").val();
            const dragtableTbodyPadding = $("#inputDragtableTbodyPadding").val();
            const dragtableTbodyStyle = `font-size:${dragtableTbodySize}px;color:${dragtableTbodyColor};display:table-cell;text-align:${dragtableTbodyAlign};padding:${dragtableTbodyPadding}px;`;

            $('#' + divId).children('div')[0].setAttribute('dragtableSql', dragtableSql);
            $('#' + divId).children('div')[0].setAttribute('dragtableTitle', dragtableTitle);
            $('#' + divId).children('div')[0].setAttribute('dragtableTitleFont', dragtableTitleFont);
            $('#' + divId).children('div')[0].setAttribute('dragtableTitleBefore', dragtableTitleBefore);
            $('#' + divId).children('div')[0].setAttribute('dragtableTime', dragtableTime);
            $('#' + divId).children('div')[0].setAttribute('dragCardColor', dragCardColor);
            $('#' + divId).children('div')[0].setAttribute('dragtableType', dragtableType);
            $('#' + divId).children('div')[0].setAttribute('dragtableLinkName', dragtableLinkName);
            $('#' + divId).children('div')[0].setAttribute('dragtableLinkPath', dragtableLinkPath);
            $('#' + divId).children('div')[0].setAttribute('dragtableLinkStyle', dragtableLinkStyle);
            $('#' + divId).children('div')[0].setAttribute('dragtableTheadStyle', dragtableTheadStyle);
            $('#' + divId).children('div')[0].setAttribute('dragtableTbodyStyle', dragtableTbodyStyle);

            $('#' + divId).children('div')[1].remove();

            var html = "";
            dragHttp.postFromAjax(dragtableSql, function (data) {
                var json = JSON.parse(data);
                var jsonCount = json.length;
                var keys = Object.keys(json[0]);
                var values = Object.values(json);
                if (jsonCount > 0) {
                    html += `<div class="card-header" style="${dragtableTitleFont}">
                                  <span class="${dragtableTitleBefore}">${dragtableTitle}</span>
                                  <a href="javascript:void(0);" onclick="dragConst.tabMenu('${dragtableLinkPath}', '${dragtableTitle}')" style="${dragtableLinkStyle}">${dragtableLinkName}</a>
                          </div>`;
                    html += `<div class="card-body">`;
                    html += `<div class="tableScroll"><table class="${dragtableType}">`;
                    html += `<thead class="theadsticky" style="background-color:${dragCardColor};"><tr>`;
                    for (var x = 0; x < keys.length; x++) {
                        html += `<th style="${dragtableTheadStyle}">` + keys[x] + `</th>`;
                    }
                    html += `</tr></thead>`;
                    html += `<tbody>`;
                    for (var x = 0; x < values.length; x++) {
                        html += "<tr>";
                        for (var y = 0; y < keys.length; y++) {
                            html += `<td style="${dragtableTbodyStyle}">` + values[x][keys[y]] + `</td>`;
                        }
                        html += `</tr>`;
                    }
                    html += `</tbody><tbody class="tbody2"></tbody></table></div></div>`;
                }
                var tempDiv = document.createElement('div');
                tempDiv.innerHTML = html;
                tempDiv.setAttribute('class', 'card');
                tempDiv.setAttribute("style", `background-color:${dragCardColor};`);
                document.getElementById(divId).appendChild(tempDiv);
                dragScroll.autoScroll(`${divId}`);
                $('#dragtableSet').modal('hide');
            });
        }
        if (tagClass == "draggaugepic") {
            var dragPicTitle = $("#inputDraggaugeTitle").val();
            var dragPicSql = inputDraggaugeSqlInstance.getValue();//$("#inputDraggaugeSql").val();
            var dragPicTime = $("#inputDraggaugeTime").val();
            var dragCardColor = $("#inputDraggaugeCardColor").val();
            const dragPicFontSize = $("#inputDraggaugeFontSize").val();
            const dragPicTitleSize = $("#inputDraggaugeTitleSize").val();
            const dragPicTitleColor = $("#inputDraggaugeTitleColor").val();
            const dragPicTitleDisplay = $("#inputDraggaugeTitleDisplay").val();
            const dragPicTitleAlign = $("#inputDraggaugeTitleAlign").val();
            const dragPicTitleFont = `font-size:${dragPicTitleSize}px;color:${dragPicTitleColor};display:${dragPicTitleDisplay};text-align:${dragPicTitleAlign};`;
            const dragPicTitleBefore = $("#inputDraggaugeTitleBefore").val();
            const dragPicLinkName = $("#inputDraggaugeLinkName").val();
            const dragPicLinkPath = $("#inputDraggaugeLinkPath").val();
            const dragPicLinkSize = $("#inputDraggaugeLinkSize").val();
            const dragPicLinkColor = $("#inputDraggaugeLinkColor").val();
            const dragPicLinkFloat = $("#inputDraggaugeLinkFloat").val();
            const dragPicLinkStyle = `font-size:${dragPicLinkSize}px;color:${dragPicLinkColor};display:block;float:${dragPicLinkFloat};`;
            $('#' + divId).children('div')[0].setAttribute('dragPicSql', dragPicSql);
            $('#' + divId).children('div')[0].setAttribute('dragPicTitle', dragPicTitle);
            $('#' + divId).children('div')[0].setAttribute('dragPicTime', dragPicTime);
            $('#' + divId).children('div')[0].setAttribute('dragCardColor', dragCardColor);
            $('#' + divId).children('div')[0].setAttribute('dragPicTitleFont', dragPicTitleFont);
            $('#' + divId).children('div')[0].setAttribute('dragPicTitleBefore', dragPicTitleBefore);
            $('#' + divId).children('div')[0].setAttribute('dragPicLinkName', dragPicLinkName);
            $('#' + divId).children('div')[0].setAttribute('dragPicLinkPath', dragPicLinkPath);
            $('#' + divId).children('div')[0].setAttribute('dragPicLinkStyle', dragPicLinkStyle);
            $('#' + divId).children('div')[0].setAttribute('dragPicFontSize', dragPicFontSize);
            $('#' + divId).children('div')[1].remove();
            dragHttp.postFromAjax(dragPicSql, function (data) {
                var json = JSON.parse(data);
                var jsonCount = json.length;
                var option = "";
                var html = `<div class="card-header" style="${dragPicTitleFont}">
                      <span class="${dragPicTitleBefore}">${dragPicTitle}</span>
                      <a href="javascript:void(0);" onclick="dragConst.tabMenu('${dragPicLinkPath}', '${dragPicTitle}')" style="${dragPicLinkStyle}">${dragPicLinkName}</a>
                      </div>
                      <div class="card-body"></div>`;
                var keys = Object.keys(json[0]);
                var values = Object.values(json[0]);
                if (jsonCount > 0) {
                    option = {
                        textStyle: {
                            fontSize: dragPicFontSize
                        },
                        tooltip: {
                            formatter: '{a} <br/>{b} : {c}%'
                        },
                        toolbox: {
                            show: true,
                            feature: {
                                mark: { show: true },
                                dataView: { show: true, readOnly: false },
                                restore: { show: true },
                                saveAsImage: { show: true }
                            }
                        },
                        series: [
                            {
                                name: dragPicTitle,
                                type: 'gauge',
                                detail: {
                                    formatter: '{value}'
                                },
                                data: [
                                    {
                                        value: values[0],
                                        name: keys[0]
                                    }
                                ]
                            }
                        ]
                    };
                }
                var tempDiv = document.createElement('div');
                tempDiv.innerHTML = html;
                tempDiv.setAttribute('class', 'card');
                tempDiv.setAttribute("style", `background-color:${dragCardColor};`);
                document.getElementById(divId).appendChild(tempDiv);
                var mydiv = $("#" + divId).children("div").children("div")[1];
                var myChart = echarts.init(mydiv);
                myChart.setOption(option);
                mydiv.setAttribute("myChart_id", myChart.id);
                $('#draggaugeSet').modal('hide');
            });
        }
        if (tagClass == "dragpiepic") {
            var dragPicTitle = $("#inputDragpieTitle").val();
            var dragPicSql = inputDragpieSqlInstance.getValue();//$("#inputDragpieSql").val();
            var dragPicTime = $("#inputDragpieTime").val();
            var dragCardColor = $("#inputDragpieCardColor").val();
            const dragPicFontSize = $("#inputDragpieFontSize").val();
            const dragPicTitleSize = $("#inputDragpieTitleSize").val();
            const dragPicTitleColor = $("#inputDragpieTitleColor").val();
            const dragPicTitleDisplay = $("#inputDragpieTitleDisplay").val();
            const dragPicTitleAlign = $("#inputDragpieTitleAlign").val();
            const dragPicTitleFont = `font-size:${dragPicTitleSize}px;color:${dragPicTitleColor};display:${dragPicTitleDisplay};text-align:${dragPicTitleAlign};`;
            const dragPicTitleBefore = $("#inputDragpieTitleBefore").val();
            const dragPicLinkName = $("#inputDragpieLinkName").val();
            const dragPicLinkPath = $("#inputDragpieLinkPath").val();
            const dragPicLinkSize = $("#inputDragpieLinkSize").val();
            const dragPicLinkColor = $("#inputDragpieLinkColor").val();
            const dragPicLinkFloat = $("#inputDragpieLinkFloat").val();
            const dragPicLinkStyle = `font-size:${dragPicLinkSize}px;color:${dragPicLinkColor};display:block;float:${dragPicLinkFloat};`;
            $('#' + divId).children('div')[0].setAttribute('dragPicSql', dragPicSql);
            $('#' + divId).children('div')[0].setAttribute('dragPicTitle', dragPicTitle);
            $('#' + divId).children('div')[0].setAttribute('dragPicTime', dragPicTime);
            $('#' + divId).children('div')[0].setAttribute('dragCardColor', dragCardColor);
            $('#' + divId).children('div')[0].setAttribute('dragPicTitleFont', dragPicTitleFont);
            $('#' + divId).children('div')[0].setAttribute('dragPicTitleBefore', dragPicTitleBefore);
            $('#' + divId).children('div')[0].setAttribute('dragPicLinkName', dragPicLinkName);
            $('#' + divId).children('div')[0].setAttribute('dragPicLinkPath', dragPicLinkPath);
            $('#' + divId).children('div')[0].setAttribute('dragPicLinkStyle', dragPicLinkStyle);
            $('#' + divId).children('div')[0].setAttribute('dragPicFontSize', dragPicFontSize);
            $('#' + divId).children('div')[1].remove();
            dragHttp.postFromAjax(dragPicSql, function (data) {
                var json = JSON.parse(data);
                var jsonCount = json.length;
                var option = "";
                var html = `<div class="card-header" style="${dragPicTitleFont}">
                      <span class="${dragPicTitleBefore}">${dragPicTitle}</span>
                      <a href="javascript:void(0);" onclick="dragConst.tabMenu('${dragPicLinkPath}', '${dragPicTitle}')" style="${dragPicLinkStyle}">${dragPicLinkName}</a>
                      </div>
                      <div class="card-body"></div>`;
                var keys = Object.keys(json[0]);
                var values = Object.values(json);
                var datas = $.map(keys, (key) => ({
                    value: values[0][key],
                    name: key
                }));
                dragwidth = 2;
                dragheight = 2;
                if (jsonCount > 0) {
                    option = {
                        textStyle: {
                            fontSize: dragPicFontSize
                        },
                        tooltip: {
                            trigger: 'item'
                        },
                        legend: {
                            top: 'bottom'
                        },
                        toolbox: {
                            show: true,
                            feature: {
                                mark: { show: true },
                                dataView: { show: true, readOnly: false },
                                restore: { show: true },
                                saveAsImage: { show: true }
                            }
                        },
                        series: [
                            {
                                name: dragPicTitle,
                                type: 'pie',
                                center: ['50%', '50%'],
                                roseType: 'area',
                                itemStyle: {
                                    borderRadius: 8
                                },
                                data: datas
                            }
                        ]
                    };

                }
                var tempDiv = document.createElement('div');
                tempDiv.innerHTML = html;
                tempDiv.setAttribute('class', 'card');
                tempDiv.setAttribute("style", `background-color:${dragCardColor};`);
                document.getElementById(divId).appendChild(tempDiv);
                var mydiv = $("#" + divId).children("div").children("div")[1];
                var myChart = echarts.init(mydiv);
                myChart.setOption(option);
                mydiv.setAttribute("myChart_id", myChart.id);
                $('#dragpieSet').modal('hide');
            });
        }
        if (tagClass == "dragbarpic") {
            var dragPicTitle = $("#inputDragbarTitle").val();
            var dragPicSql = inputDragbarSqlInstance.getValue(); //$("#inputDragbarSql").val();
            var dragPicTime = $("#inputDragbarTime").val();
            var dragCardColor = $("#inputDragbarCardColor").val();
            const dragPicFontSize = $("#inputDragbarFontSize").val();
            const dragPicTitleSize = $("#inputDragbarTitleSize").val();
            const dragPicTitleColor = $("#inputDragbarTitleColor").val();
            const dragPicTitleDisplay = $("#inputDragbarTitleDisplay").val();
            const dragPicTitleAlign = $("#inputDragbarTitleAlign").val();
            const dragPicTitleFont = `font-size:${dragPicTitleSize}px;color:${dragPicTitleColor};display:${dragPicTitleDisplay};text-align:${dragPicTitleAlign};`;
            const dragPicTitleBefore = $("#inputDragbarTitleBefore").val();
            const dragPicLinkName = $("#inputDragbarLinkName").val();
            const dragPicLinkPath = $("#inputDragbarLinkPath").val();
            const dragPicLinkSize = $("#inputDragbarLinkSize").val();
            const dragPicLinkColor = $("#inputDragbarLinkColor").val();
            const dragPicLinkFloat = $("#inputDragbarLinkFloat").val();
            const dragPicLinkStyle = `font-size:${dragPicLinkSize}px;color:${dragPicLinkColor};display:block;float:${dragPicLinkFloat};`;
            const dragPicTypes = $("#inputDragbarTypes").val();
            $('#' + divId).children('div')[0].setAttribute('dragPicSql', dragPicSql);
            $('#' + divId).children('div')[0].setAttribute('dragPicTitle', dragPicTitle);
            $('#' + divId).children('div')[0].setAttribute('dragPicTime', dragPicTime);
            $('#' + divId).children('div')[0].setAttribute('dragCardColor', dragCardColor);
            $('#' + divId).children('div')[0].setAttribute('dragPicTitleFont', dragPicTitleFont);
            $('#' + divId).children('div')[0].setAttribute('dragPicTitleBefore', dragPicTitleBefore);
            $('#' + divId).children('div')[0].setAttribute('dragPicLinkName', dragPicLinkName);
            $('#' + divId).children('div')[0].setAttribute('dragPicLinkPath', dragPicLinkPath);
            $('#' + divId).children('div')[0].setAttribute('dragPicLinkStyle', dragPicLinkStyle);
            $('#' + divId).children('div')[0].setAttribute('dragPicFontSize', dragPicFontSize);
            $('#' + divId).children('div')[0].setAttribute('dragPicTypes', dragPicTypes);
            $('#' + divId).children('div')[1].remove();
            dragHttp.postFromAjax(dragPicSql, function (data) {
                var json = JSON.parse(data);
                var jsonCount = json.length;
                var option = "";
                var html = `<div class="card-header" style="${dragPicTitleFont}">
                      <span class="${dragPicTitleBefore}">${dragPicTitle}</span>
                      <a href="javascript:void(0);" onclick="dragConst.tabMenu('${dragPicLinkPath}', '${dragPicTitle}')" style="${dragPicLinkStyle}">${dragPicLinkName}</a>
                      </div>
                      <div class="card-body"></div>`;
                let legendDatas = Object.keys(json[0]);
                const values = Object.values(json);
                const keys = $.map(values, (item) => item[legendDatas[0]]);
                legendDatas.shift();
                const getTypes = dragPicTypes.split(",");
                const newArr = dragConst.barTypes.map((value, index) => getTypes[index] || value);
                const datas = legendDatas.map((key, index) => ({
                    name: key,
                    type: newArr[index],
                    data: json.map(item => item[key])
                }));
                if (jsonCount > 0) {
                    option = {
                        textStyle: {
                            fontSize: dragPicFontSize
                        },
                        toolbox: {
                            show: true,
                            feature: {
                                mark: { show: true },
                                dataView: { show: true, readOnly: false },
                                restore: { show: true },
                                saveAsImage: { show: true }
                            }
                        },
                        tooltip: {
                            trigger: 'item'
                        },
                        grid: {
                            left: '3%',
                            right: '4%',
                            bottom: '3%',
                            containLabel: true
                        },
                        legend: {
                            data: legendDatas
                        },
                        xAxis: [
                            {
                                type: 'category',
                                data: keys,
                                axisTick: {
                                    alignWithLabel: true
                                }
                            }
                        ],
                        yAxis: [
                            {
                                type: 'value'
                            }
                        ],
                        series: datas
                    };

                }
                var tempDiv = document.createElement('div');
                tempDiv.innerHTML = html;
                tempDiv.setAttribute('class', 'card');
                tempDiv.setAttribute("style", `background-color:${dragCardColor};`);
                document.getElementById(divId).appendChild(tempDiv);
                var mydiv = $("#" + divId).children("div").children("div")[1];
                var myChart = echarts.init(mydiv);
                myChart.setOption(option);
                mydiv.setAttribute("myChart_id", myChart.id);
                $('#dragbarSet').modal('hide');
            });
        }
        if (tagClass == "draglinepic") {
            var dragPicTitle = $("#inputDraglineTitle").val();
            var dragPicSql = inputDraglineSqlInstance.getValue();//$("#inputDraglineSql").val();
            var dragPicTime = $("#inputDraglineTime").val();
            var dragCardColor = $("#inputDraglineCardColor").val();
            const dragPicFontSize = $("#inputDraglineFontSize").val();
            const dragPicTitleSize = $("#inputDraglineTitleSize").val();
            const dragPicTitleColor = $("#inputDraglineTitleColor").val();
            const dragPicTitleDisplay = $("#inputDraglineTitleDisplay").val();
            const dragPicTitleAlign = $("#inputDraglineTitleAlign").val();
            const dragPicTitleFont = `font-size:${dragPicTitleSize}px;color:${dragPicTitleColor};display:${dragPicTitleDisplay};text-align:${dragPicTitleAlign};`;
            const dragPicTitleBefore = $("#inputDraglineTitleBefore").val();
            const dragPicLinkName = $("#inputDraglineLinkName").val();
            const dragPicLinkPath = $("#inputDraglineLinkPath").val();
            const dragPicLinkSize = $("#inputDraglineLinkSize").val();
            const dragPicLinkColor = $("#inputDraglineLinkColor").val();
            const dragPicLinkFloat = $("#inputDraglineLinkFloat").val();
            const dragPicLinkStyle = `font-size:${dragPicLinkSize}px;color:${dragPicLinkColor};display:block;float:${dragPicLinkFloat};`;
            const dragPicTypes = $("#inputDraglineTypes").val();
            $('#' + divId).children('div')[0].setAttribute('dragPicSql', dragPicSql);
            $('#' + divId).children('div')[0].setAttribute('dragPicTitle', dragPicTitle);
            $('#' + divId).children('div')[0].setAttribute('dragPicTime', dragPicTime);
            $('#' + divId).children('div')[0].setAttribute('dragCardColor', dragCardColor);
            $('#' + divId).children('div')[0].setAttribute('dragPicTitleFont', dragPicTitleFont);
            $('#' + divId).children('div')[0].setAttribute('dragPicTitleBefore', dragPicTitleBefore);
            $('#' + divId).children('div')[0].setAttribute('dragPicLinkName', dragPicLinkName);
            $('#' + divId).children('div')[0].setAttribute('dragPicLinkPath', dragPicLinkPath);
            $('#' + divId).children('div')[0].setAttribute('dragPicLinkStyle', dragPicLinkStyle);
            $('#' + divId).children('div')[0].setAttribute('dragPicFontSize', dragPicFontSize);
            $('#' + divId).children('div')[0].setAttribute('dragPicTypes', dragPicTypes);
            $('#' + divId).children('div')[1].remove();
            dragHttp.postFromAjax(dragPicSql, function (data) {
                var json = JSON.parse(data);
                var jsonCount = json.length;
                var option = "";
                var html = `<div class="card-header" style="${dragPicTitleFont}">
                      <span class="${dragPicTitleBefore}">${dragPicTitle}</span>
                      <a href="javascript:void(0);" onclick="dragConst.tabMenu('${dragPicLinkPath}', '${dragPicLinkName}')" style="${dragPicLinkStyle}">${dragPicLinkName}</a>
                      </div>
                      <div class="card-body"></div>`;
                let legendDatas = Object.keys(json[0]);
                const values = Object.values(json);
                const keys = $.map(values, (item) => item[legendDatas[0]]);
                legendDatas.shift();
                const datas = legendDatas.map(key => ({
                    name: key,
                    type: "line",
                    data: json.map(item => item[key])
                }));
                if (jsonCount > 0) {
                    option = {
                        textStyle: {
                            fontSize: dragPicFontSize
                        },
                        toolbox: {
                            show: true,
                            feature: {
                                mark: { show: true },
                                dataView: { show: true, readOnly: false },
                                restore: { show: true },
                                saveAsImage: { show: true }
                            }
                        },
                        tooltip: {
                            trigger: "axis",
                        },
                        legend: {
                            data: legendDatas,
                        },
                        xAxis: {
                            type: "category",
                            boundaryGap: false,
                            data: keys,
                        },
                        yAxis: {
                            type: "value",
                        },
                        series: datas,
                    };
                }
                var tempDiv = document.createElement('div');
                tempDiv.innerHTML = html;
                tempDiv.setAttribute('class', 'card');
                tempDiv.setAttribute("style", `background-color:${dragCardColor};`);
                document.getElementById(divId).appendChild(tempDiv);
                var mydiv = $("#" + divId).children("div").children("div")[1];
                var myChart = echarts.init(mydiv);
                myChart.setOption(option);
                mydiv.setAttribute("myChart_id", myChart.id);
                $('#draglineSet').modal('hide');
            });
        }
    },
    setIntervalDiv: function (divId, t1, sql, dragPicTypes) {
        //先延迟后按照定时器执行更新
        var tagClass = $('#' + divId).attr('class').split(" ")[0];
        if (sql == null || sql == "") {
            return;
        }
        if (tagClass == "dragonelabel") {
            setTimeout(function () {
                setInterval(function () {
                    dragHttp.postFromAjax(sql, function (data) {
                        var json = JSON.parse(data);
                        var jsonCount = json.length;
                        var keys = Object.keys(json[0]);
                        var values = Object.values(json[0]);
                        if (jsonCount > 0) {
                            $('#' + divId).children('div').children("div").children("div")[1].textContent = keys[0];
                            $('#' + divId).children('div').children("div").children("div")[0].textContent = values[0];
                        }
                    });
                }, t1 * dragConst.millisecondsToMinutes);
            }, t1 * dragConst.millisecondsToMinutes);
        }
        if (tagClass == "dragcardlabel") {
            setTimeout(function () {
                setInterval(function () {
                    dragHttp.postFromAjax(sql, function (data) {
                        var json = JSON.parse(data);
                        var jsonCount = json.length;
                        var keys = Object.keys(json[0]);
                        var values = Object.values(json[0]);
                        if (jsonCount > 0) {
                            $('#' + divId).children('div').children("div").children("div").children("div").children("h3")[0].textContent = dragConst.addThousandSeparator(values[0]);
                            $('#' + divId).children('div').children("div").children("div").children("div").children("p")[0].textContent = keys[0];
                            if (keys.length > 1) {
                                $('#' + divId).children('div').children("div").children("div").children("div").children("p").children("span")[0].textContent = dragConst.addThousandSeparator(values[1]);
                                var spanElement = $('#' + divId).children('div').children("div").children("div").children("div").children("p").children("span")[0];
                                var paragraphElement = $('#' + divId).children('div').children("div").children("div").children("div").children("p")[1];
                                // 将<span>标签放在<p>标签的文本内容之前
                                paragraphElement.innerHTML = '';
                                paragraphElement.appendChild(spanElement);
                                paragraphElement.appendChild(document.createTextNode(keys[1]));
                            }
                        }
                    });
                }, t1 * dragConst.millisecondsToMinutes);
            }, t1 * dragConst.millisecondsToMinutes);
        }
        if (tagClass == "dragtable") {
            setTimeout(function () {
                setInterval(function () {
                    dragHttp.postFromAjax(sql, function (data) {
                        var json = JSON.parse(data);
                        var jsonCount = json.length;
                        var keys = Object.keys(json[0]);
                        var values = Object.values(json);
                        const backgroundColor = $("#" + divId).children("div").css("background-color");
                        const dragtableType = $("#" + divId).children('div').children('div').children('div').children('table').attr("class");
                        const dragtableTheadStyle = $("#" + divId).children('div').children('div').children('div').children('table').children("thead").children("tr").children("th").attr("style");
                        const dragtableTbodyStyle = $("#" + divId).children('div').children('div').children('div').children('table').children("tbody").children("tr").children("td").attr("style");
                        var html = "";
                        if (jsonCount > 0) {
                            $('#' + divId).children('div').children('div').children('div')[0].remove();
                            html += `<table class="${dragtableType}">`;
                            html += `<thead class="theadsticky" style="background-color:${backgroundColor};"><tr>`;
                            for (var x = 0; x < keys.length; x++) {
                                html += `<th style="${dragtableTheadStyle}">` + keys[x] + `</th>`;
                            }
                            html += `</tr></thead>`;
                            html += `<tbody>`;
                            for (var x = 0; x < values.length; x++) {
                                html += "<tr>";
                                for (var y = 0; y < keys.length; y++) {
                                    html += `<td style="${dragtableTbodyStyle}">` + values[x][keys[y]] + `</td>`;
                                }
                                html += `</tr>`;
                            }
                            html += `</tbody><tbody class="tbody2"></tbody></table>`;
                            var tempDiv = document.createElement('div');
                            tempDiv.innerHTML = html;
                            tempDiv.setAttribute('class', 'tableScroll');
                            $('#' + divId).children('div').children('div')[1].appendChild(tempDiv);
                            dragScroll.autoScroll(`${divId}`);
                        }
                    });
                }, t1 * dragConst.millisecondsToMinutes);
            }, t1 * dragConst.millisecondsToMinutes);
        }
        if (tagClass == "draggaugepic") {
            setTimeout(function () {
                setInterval(function () {
                    dragHttp.postFromAjax(sql, function (data) {
                        var json = JSON.parse(data);
                        var jsonCount = json.length;
                        var option = "";
                        var keys = Object.keys(json[0]);
                        var values = Object.values(json[0]);
                        if (jsonCount > 0) {
                            option = {
                                series: [
                                    {
                                        data: [
                                            {
                                                value: values[0],
                                                name: keys[0]
                                            }
                                        ]
                                    }
                                ]
                            };
                        }
                        var mydiv = $("#" + divId).children("div").children("div")[1];
                        var myChart = echarts.getInstanceByDom(mydiv);
                        myChart.setOption(option);
                    });
                }, t1 * dragConst.millisecondsToMinutes);
            }, t1 * dragConst.millisecondsToMinutes);

        }
        if (tagClass == "dragpiepic") {
            setTimeout(function () {
                setInterval(function () {
                    dragHttp.postFromAjax(sql, function (data) {
                        var json = JSON.parse(data);
                        var jsonCount = json.length;
                        var option = "";
                        var keys = Object.keys(json[0]);
                        var values = Object.values(json);
                        var datas = $.map(keys, (key) => ({
                            value: values[0][key],
                            name: key
                        }));
                        if (jsonCount > 0) {
                            option = {
                                series: [
                                    {
                                        data: datas
                                    }
                                ]
                            };
                        }
                        var mydiv = $("#" + divId).children("div").children("div")[1];
                        var myChart = echarts.getInstanceByDom(mydiv);
                        myChart.setOption(option);
                    });
                }, t1 * dragConst.millisecondsToMinutes);
            }, t1 * dragConst.millisecondsToMinutes);
        }
        if (tagClass == "dragbarpic") {
            setTimeout(function () {
                setInterval(function () {
                    dragHttp.postFromAjax(sql, function (data) {
                        const json = JSON.parse(data);
                        const jsonCount = json.length;
                        let option = "";
                        let legendDatas = Object.keys(json[0]);
                        const values = Object.values(json);
                        const keys = $.map(values, (item) => item[legendDatas[0]]);
                        legendDatas.shift();
                        const getTypes = dragPicTypes.split(",");
                        const newArr = dragConst.barTypes.map((value, index) => getTypes[index] || value);
                        const datas = legendDatas.map((key, index) => ({
                            name: key,
                            type: newArr[index],
                            data: json.map(item => item[key])
                        }));
                        if (jsonCount > 0) {
                            option = {
                                legend: {
                                    data: legendDatas
                                },
                                xAxis: [
                                    {
                                        data: keys
                                    }
                                ],
                                series: datas
                            };
                        }
                        var mydiv = $("#" + divId).children("div").children("div")[1];
                        var myChart = echarts.getInstanceByDom(mydiv);
                        myChart.setOption(option);
                    });
                }, t1 * dragConst.millisecondsToMinutes);
            }, t1 * dragConst.millisecondsToMinutes);
        }
        if (tagClass == "draglinepic") {
            setTimeout(function () {
                setInterval(function () {
                    dragHttp.postFromAjax(sql, function (data) {
                        var json = JSON.parse(data);
                        var jsonCount = json.length;
                        var option = "";
                        let legendDatas = Object.keys(json[0]);
                        const values = Object.values(json);
                        const keys = $.map(values, (item) => item[legendDatas[0]]);
                        legendDatas.shift();
                        const datas = legendDatas.map(key => ({
                            name: key,
                            type: "line",
                            data: json.map(item => item[key])
                        }));
                        if (jsonCount > 0) {
                            option = {
                                legend: {
                                    data: legendDatas
                                },
                                xAxis: {
                                    data: keys
                                },
                                series: datas
                            };
                        }
                        var mydiv = $("#" + divId).children("div").children("div")[1];
                        var myChart = echarts.getInstanceByDom(mydiv);
                        myChart.setOption(option);
                    });
                }, t1 * dragConst.millisecondsToMinutes);
            }, t1 * dragConst.millisecondsToMinutes);
        }
    }
}

var dragOutPutHtml = {
    modelDiv: function () {
        var fullHtml = $('html').html();
        //截取html静态页面<body>到<!--看板-->
        var bodyStartPos = fullHtml.indexOf("<body");
        var bodyEndPos = fullHtml.indexOf("<!--看板-->") + "<!--看板-->".length;
        var extractedContent = fullHtml.slice(bodyStartPos, bodyEndPos);
        var jscssStart = fullHtml.indexOf("<!--jscssstart-->");
        var jscssEnd = fullHtml.indexOf("<!--jscssend-->") + "<!--jscssend-->".length;
        var jscssContent = fullHtml.slice(jscssStart, jscssEnd);
        const title = $('#title').text().trim();
        const titleStyle = $('#title').attr("style");
        const titleNewStyle = $('#title').attr("newstyle");
        var html = `<!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>`+ title + `</title>
          ${jscssContent}
        </head>
        `+ extractedContent + `
          <div id="title" class="title handle-title" style="`+ titleStyle + `" newstyle="${titleNewStyle}">
            `+ title + `
          </div>
          <div class="gridster">
            <ul>
            </ul>
          </div>
      
      
          <script type="text/javascript">
            $(document).ready(function(){ 
            `;

        // 加载布置的div
        $('.gridster ul li').each(function (index) {
            var divId = $(this).find('.handle-resize').attr('id');
            var tagClass = $('#' + divId).attr('class').split(" ")[0];
            if (tagClass == "dragonelabel") {
                var row = $('#' + divId).parent().attr("data-row");
                var col = $('#' + divId).parent().attr("data-col");
                var dragwidth = $('#' + divId).parent().attr("data-sizex");
                var dragheight = $('#' + divId).parent().attr("data-sizey");
                const draglabelParams = {
                    draglabelTitleFont: $('#' + divId).children('div')[0].getAttribute('draglabelTitleFont'),
                    draglabelCountFont: $('#' + divId).children('div')[0].getAttribute('draglabelCountFont'),
                    draglabelLink: $('#' + divId).children('div')[0].getAttribute('draglabelLink'),
                    draglabelLinkTitle: $('#' + divId).children('div')[0].getAttribute('draglabelLinkTitle'),
                    draglabelLinkFont: $('#' + divId).children('div')[0].getAttribute('draglabelLinkFont'),
                    draglabelSql: $('#' + divId).children('div')[0].getAttribute('draglabelSql'),
                    draglabelImage: $('#' + divId).children('div')[0].getAttribute('draglabelImage'),
                    draglabelBG: $('#' + divId).children('div')[0].getAttribute('draglabelBG'),
                    draglabelTime: $('#' + divId).children('div')[0].getAttribute('draglabelTime'),
                    draglabelImageStyle: $('#' + divId).children('div')[0].getAttribute('draglabelImageStyle'),
                };
                const htmlAttributes = Object.entries(draglabelParams)
                    .map(([param, value]) => ` ${param}="${value}"`)
                    .join("");
                html += `dragHttp.postFromAjax(\`` + draglabelParams.draglabelSql + `\`,function(data){
                  var json=JSON.parse(data);
                  var jsonCount=json.length;
                  var keys=Object.keys(json[0]);
                  var values=Object.values(json[0]);
                  var html=\`<li><div id="`+ divId + `" class="dragonelabel small-box ${draglabelParams.draglabelBG} handle-resize" >\`;
                  if(jsonCount>0){
                      html+=\`<div ${htmlAttributes}
                      style="display:none;" ></div>\`;
                      html += \`<div><div class="inner"><div class="inner-count" style="` + draglabelParams.draglabelCountFont + `">\` + values[0] + \`</div>
                      <div class="inner-title" style="`+ draglabelParams.draglabelTitleFont + `">\` + keys[0] + \`</div></div>\`;
                      html += \`<div class="icon" style="${draglabelParams.draglabelImageStyle}">
                      <i class="ion ${draglabelParams.draglabelImage}"></i>
                      </div>\`;
                      html += \`<a onclick="dragConst.tabMenu('${draglabelParams.draglabelLink}', '${draglabelParams.draglabelLinkTitle}')" class="small-box-footer" href="###" style="` + draglabelParams.draglabelLinkFont + `">` + draglabelParams.draglabelLinkTitle + `<i class="fa fa-arrow-circle-right"></i></a>\`;
                      html+=\`</div>\`;
                  }
                  html+=\`
                  </div>
                  </li>\`;
                  gridster.add_widget(html,`+ dragwidth + `,` + dragheight + `, ` + col + `,` + row + `);
                  });
                  `;
            }
            if (tagClass == "draglabel") {
                var row = $('#' + divId).parent().parent().parent().attr("data-row");
                var col = $('#' + divId).parent().parent().parent().attr("data-col");
                var dragwidth = $('#' + divId).parent().parent().parent().attr("data-sizex");
                var dragheight = $('#' + divId).parent().parent().parent().attr("data-sizey");
                var draglabelTitle = $('#' + divId).children('div')[0].getAttribute('draglabelTitle');
                var draglabelTitleFont = $('#' + divId).children('div')[0].getAttribute('draglabelTitleFont');
                var draglabelCTitleFont = $('#' + divId).children('div')[0].getAttribute('draglabelCTitleFont');
                var draglabelCCountFont = $('#' + divId).children('div')[0].getAttribute('draglabelCCountFont');
                var draglabelCLinkFont = $('#' + divId).children('div')[0].getAttribute('draglabelCLinkFont');
                var sql = $('#' + divId).children('div')[0].getAttribute('draglabelSql');
                html += `dragHttp.postFromAjax(\`` + sql + `\`,function(data){
                      var json=JSON.parse(data);
                      var jsonCount=json.length;
                      var keys=Object.keys(json[0]);
                      var values=Object.values(json[0]);
                      var percentage=100/keys.length;
                      var urls="";
                      var html=\`<li><div class="card"><div class="card-body"><div id="`+ divId + `" class="draglabel handle-resize" >\`;
                      html+=\`<div draglabelSql="`+ sql + `" draglabelTitle="` + draglabelTitle + `" 
                      draglabelTitleFont="`+ draglabelTitleFont + `" draglabelCTitleFont="` + draglabelCTitleFont + `" 
                      draglabelCCountFont="`+ draglabelCCountFont + `" draglabelCLinkFont="` + draglabelCLinkFont + `"
                      style="display:none;" ></div>\`;
                      html+=\`<div style="`+ draglabelTitleFont + `">` + draglabelTitle + `</div>\`;
                      if(jsonCount>1){
                          urls=Object.values(json[1]);
                      }
                      for(var x=0;x<keys.length;x++){
                          html+=\`
                          <div style="width: \`+percentage+\`%; height: 100%; float: left">
                  <div style="`+ draglabelCTitleFont + `">\`+keys[x]+\`</div>
                  <div style="`+ draglabelCCountFont + `">\`+values[x]+\`</div>\`
                  if(urls!=""&&urls[x]!=""&&urls[x]!=" "){
                      html+=\`<a target="_blank" href="\`+urls[x]+\`" style="`+ draglabelCLinkFont + `">\`+keys[x]+\`</a>\`;
                  }
                  html+=\`</div>\`;
              }
              html+=\`
              </div>
              </div></div>
              </li>\`;
              gridster.add_widget(html,`+ dragwidth + `,` + dragheight + `, ` + col + `,` + row + `);
          });
          `;
            }
            if (tagClass == "dragcardlabel") {
                var row = $('#' + divId).parent().attr("data-row");
                var col = $('#' + divId).parent().attr("data-col");
                var dragwidth = $('#' + divId).parent().attr("data-sizex");
                var dragheight = $('#' + divId).parent().attr("data-sizey");
                const draglabelParams = {
                    draglabelTitleFont: $('#' + divId).children('div')[0].getAttribute('draglabelTitleFont'),
                    draglabelCountFont: $('#' + divId).children('div')[0].getAttribute('draglabelCountFont'),
                    draglabelTitle2Font: $('#' + divId).children('div')[0].getAttribute('draglabelTitle2Font'),
                    draglabelCount2Font: $('#' + divId).children('div')[0].getAttribute('draglabelCount2Font'),
                    draglabelSql: $('#' + divId).children('div')[0].getAttribute('draglabelSql'),
                    draglabelImage: $('#' + divId).children('div')[0].getAttribute('draglabelImage'),
                    draglabelBG: $('#' + divId).children('div')[0].getAttribute('draglabelBG'),
                    draglabelTime: $('#' + divId).children('div')[0].getAttribute('draglabelTime'),
                    dragCardColor: $('#' + divId).children('div')[0].getAttribute('dragCardColor'),
                    draglabelImageStyle: $('#' + divId).children('div')[0].getAttribute('draglabelImageStyle'),
                };
                const strs = draglabelParams.draglabelImageStyle.split(";");
                const draglabelImageSize = strs[0].split(":")[1].replace("px", "");
                const draglabelImageDivSize = draglabelImageSize * 1.25;
                const ImageDivStyle1 = `border-radius:${draglabelImageDivSize}px;width:${draglabelImageDivSize}px;height:${draglabelImageDivSize}px;line-height:${draglabelImageDivSize}px;`;
                const ImageDivStyle2 = `font-size: ${draglabelImageSize}px;`;
                const htmlAttributes = Object.entries(draglabelParams)
                    .map(([param, value]) => ` ${param}="${value}"`)
                    .join("");
                html += `dragHttp.postFromAjax(\`` + draglabelParams.draglabelSql + `\`,function(data){
                  var json=JSON.parse(data);
                  var jsonCount=json.length;
                  var keys=Object.keys(json[0]);
                  var values=Object.values(json[0]);
                  var html=\`<li><div id="${divId}" class="dragcardlabel handle-resize" >\`;
                  if(jsonCount>0){
                      html+=\`<div ${htmlAttributes}
                      style="display:none;" ></div>\`;
                      html += \`<div class="card" style="background-color:${draglabelParams.dragCardColor}"> <div class="card-body">
                        <div class="row"><div class="col">
                            <h3 style="${draglabelParams.draglabelCountFont}" class="mb-2 fw-semibold">\${dragConst.addThousandSeparator(values[0])}</h3>
                            <p style="${draglabelParams.draglabelTitleFont}" class="text-muted fs-15 mb-0">\${keys[0]}</p>\`;
                      if (keys.length >1) {
                                html += \`
                      <p style="${draglabelParams.draglabelTitle2Font}" class="text-muted mb-0 mt-2 fs-12">
                          <span style="${draglabelParams.draglabelCount2Font}" class="icn-box text-success fw-semibold fs-15 me-1">
                              \${dragConst.addThousandSeparator(values[1])}</span>
                              \${keys[1]} </p>\`;
                        }
                            html += \`
                        </div>
                            <div class="col col-auto top-icn" style="${ImageDivStyle2}">
                                <div class="counter-icon ${draglabelParams.draglabelBG} dash ms-auto box-shadow-primary" style="${ImageDivStyle1}">
                                    <i class="ion ${draglabelParams.draglabelImage}" style="${draglabelParams.draglabelImageStyle}"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    </div >\`;
                  }
                  html+=\`
                  </div>
                  </li>\`;
                  gridster.add_widget(html,`+ dragwidth + `,` + dragheight + `, ` + col + `,` + row + `);
                  });
                  `;
            }
            if (tagClass == "draglink") {
                var row = $('#' + divId).parent().attr("data-row");
                var col = $('#' + divId).parent().attr("data-col");
                var dragwidth = $('#' + divId).parent().attr("data-sizex");
                var dragheight = $('#' + divId).parent().attr("data-sizey");
                const dragParams = {
                    draglinkImage: $('#' + divId).children('div')[0].getAttribute('draglinkImage'),
                    draglinkBG: $('#' + divId).children('div')[0].getAttribute('draglinkBG'),
                    draglink: $('#' + divId).children('div')[0].getAttribute('draglink'),
                    draglinkTitle: $('#' + divId).children('div')[0].getAttribute('draglinkTitle'),
                    draglinkTitleFont: $('#' + divId).children('div')[0].getAttribute('draglinkTitleFont'),
                    draglinkStyle: $('#' + divId).children('div')[0].getAttribute('draglinkStyle'),
                    draglinkLabel: $('#' + divId).children('div')[0].getAttribute('draglinkLabel'),
                    draglinkImageStyle: $('#' + divId).children('div')[0].getAttribute('draglinkImageStyle'),
                };
                const divAttributes = Object.entries(dragParams)
                    .map(([param, value]) => ` ${param}="${value}"`)
                    .join("");
                html += `{
                      var html=\`<li><div id="` + divId + `" class="draglink small-box ` + dragParams.draglinkBG + ` handle-resize" >\`;
                      html += \`<div ${divAttributes} style="display:none;" ></div>
                  <div>
                  <div class="inner">
                      <div class="inner-title" style="`+ dragParams.draglinkTitleFont + `">` + dragParams.draglinkTitle + `</div>
                  </div>
                  <div class="icon" style="${dragParams.draglinkImageStyle}">
                      <i class="ion `+ dragParams.draglinkImage + `"></i>
                  </div>
                  <a onclick="dragConst.tabMenu('${dragParams.draglink}', '${dragParams.draglinkTitle}')" href="###" class="small-box-footer" style="` + dragParams.draglinkStyle + `">` + dragParams.draglinkLabel + ` <i class="fa fa-arrow-circle-right"></i></a>
                  </div>
                  </div>
              </li >\`;
              gridster.add_widget(html,`+ dragwidth + `,` + dragheight + `, ` + col + `,` + row + `);
                  }
                  `;
            }
            if (tagClass == "dragcardlink") {
                var row = $('#' + divId).parent().attr("data-row");
                var col = $('#' + divId).parent().attr("data-col");
                var dragwidth = $('#' + divId).parent().attr("data-sizex");
                var dragheight = $('#' + divId).parent().attr("data-sizey");
                const dragParams = {
                    draglinkImage: $('#' + divId).children('div')[0].getAttribute('draglinkImage'),
                    draglinkImageStyle: $('#' + divId).children('div')[0].getAttribute('draglinkImageStyle'),
                    draglinkTitle: $('#' + divId).children('div')[0].getAttribute('draglinkTitle'),
                    draglinkTitleFont: $('#' + divId).children('div')[0].getAttribute('draglinkTitleFont'),
                    draglink: $('#' + divId).children('div')[0].getAttribute('draglink'),
                    dragCardColor: $('#' + divId).children('div')[0].getAttribute('dragCardColor'),
                };
                const divAttributes = Object.entries(dragParams)
                    .map(([param, value]) => ` ${param}="${value}"`)
                    .join("");
                html += `{
                      var html = \`<li><div id="${divId}" class="dragcardlink handle-resize" >\`;
          html += \`<div ${divAttributes} style="display:none;" ></div>\`;
          html += \`<div class="card" style="background-color:${dragParams.dragCardColor}">
                      <div class="card-body" style="text-align: center;">
                          <a onclick="dragConst.tabMenu('${dragParams.draglink}', '${dragParams.draglinkTitle}')" href="###">
                              <i class="${dragParams.draglinkImage}" style="${dragParams.draglinkImageStyle}"></i>
                              <span style="${dragParams.draglinkTitleFont}">${dragParams.draglinkTitle}</span>
                          </a>
                      </div>
                  </div>
              \`;
          html += \`
          </div>
          </li>\`;
              gridster.add_widget(html,`+ dragwidth + `,` + dragheight + `, ` + col + `,` + row + `);
                  }
                  `;
            }
            if (tagClass == "dragtable") {
                var row = $('#' + divId).parent().attr("data-row");
                var col = $('#' + divId).parent().attr("data-col");
                var dragwidth = $('#' + divId).parent().attr("data-sizex");
                var dragheight = $('#' + divId).parent().attr("data-sizey");
                const dragParams = {
                    dragtableTitle: $('#' + divId).children('div')[0].getAttribute('dragtableTitle'),
                    dragtableTitleBefore: $('#' + divId).children('div')[0].getAttribute('dragtableTitleBefore'),
                    dragtableTitleFont: $('#' + divId).children('div')[0].getAttribute('dragtableTitleFont'),
                    dragtableSql: $('#' + divId).children('div')[0].getAttribute('dragtableSql'),
                    dragtableTime: $('#' + divId).children('div')[0].getAttribute('dragtableTime'),
                    dragCardColor: $('#' + divId).children('div')[0].getAttribute('dragCardColor'),
                    dragtableType: $('#' + divId).children('div')[0].getAttribute('dragtableType'),
                    dragtableLinkName: $('#' + divId).children('div')[0].getAttribute('dragtableLinkName'),
                    dragtableLinkPath: $('#' + divId).children('div')[0].getAttribute('dragtableLinkPath'),
                    dragtableLinkStyle: $('#' + divId).children('div')[0].getAttribute('dragtableLinkStyle'),
                    dragtableTheadStyle: $('#' + divId).children('div')[0].getAttribute('dragtableTheadStyle'),
                    dragtableTbodyStyle: $('#' + divId).children('div')[0].getAttribute('dragtableTbodyStyle'),
                };
                const divAttributes = Object.entries(dragParams)
                    .map(([param, value]) => ` ${param}="${value}"`)
                    .join("");
                html += `dragHttp.postFromAjax(\`${dragParams.dragtableSql}\`,function(data){
                      var json=JSON.parse(data);
                      var jsonCount=json.length;
                      var keys=Object.keys(json[0]);
                      var values=Object.values(json);
                      var html=\`<li><div id="`+ divId + `" class="dragtable handle-resize" >\`;
                      html+=\`<div ${divAttributes} style="display:none;" ></div>\`;
                      html += \`<div class="card" style="background-color:${dragParams.dragCardColor}"><div class="card-header" style="${dragParams.dragtableTitleFont}">
                                  <span class="${dragParams.dragtableTitleBefore}">${dragParams.dragtableTitle}</span>
                                  <a href="javascript:void(0);" onclick="dragConst.tabMenu('${dragParams.dragtableLinkPath}', '${dragParams.dragtableTitle}')" style="${dragParams.dragtableLinkStyle}">${dragParams.dragtableLinkName}</a>
                              </div>\`;
                      html+= \`<div class="card-body">\`;
                      html+=\`<div class="tableScroll">\`;
                      if(jsonCount>0){
                          html+=\`<table class="${dragParams.dragtableType}">\`;
                          html+=\`<thead class="theadsticky" style="background-color:${dragParams.dragCardColor};"><tr>\`;
                          for(var x=0;x<keys.length;x++){
                              html+=\`<th style="${dragParams.dragtableTheadStyle}">\`+keys[x]+\`</th>\`;
                          }
                          html+=\`</tr></thead>\`;
                          html+=\`<tbody>\`;
                          for(var x=0;x<values.length;x++){
                              html+="<tr>";
                              for(var y=0;y<keys.length;y++){
                                  html+=\`<td style="${dragParams.dragtableTbodyStyle}">\`+values[x][keys[y]]+\`</td>\`;
                              }
                              html+=\`</tr>\`;
                          }
                          html+=\`</tbody>\`;
                          html+=\`<tbody class="tbody2"></tbody></table>\`;
                      }
                      html+=\`
                      </div>
                      </div>
                      </div></div>
                      </li>\`;
                      gridster.add_widget(html,`+ dragwidth + `,` + dragheight + `, ` + col + `,` + row + `);
                      dragScroll.autoScroll(\`${divId}\`);
                  });
                  `;
            }
            if (tagClass == "draggaugepic") {
                var row = $('#' + divId).parent().attr("data-row");
                var col = $('#' + divId).parent().attr("data-col");
                var dragwidth = $('#' + divId).parent().attr("data-sizex");
                var dragheight = $('#' + divId).parent().attr("data-sizey");
                const dragParams = {
                    dragPicTitle: $('#' + divId).children('div')[0].getAttribute('dragPicTitle'),
                    dragPicSql: $('#' + divId).children('div')[0].getAttribute('dragPicSql'),
                    dragPicTime: $('#' + divId).children('div')[0].getAttribute('dragPicTime'),
                    dragCardColor: $('#' + divId).children('div')[0].getAttribute('dragCardColor'),
                    dragPicTitleBefore: $('#' + divId).children('div')[0].getAttribute('dragPicTitleBefore'),
                    dragPicTitleFont: $('#' + divId).children('div')[0].getAttribute('dragPicTitleFont'),
                    dragPicLinkName: $('#' + divId).children('div')[0].getAttribute('dragPicLinkName'),
                    dragPicLinkPath: $('#' + divId).children('div')[0].getAttribute('dragPicLinkPath'),
                    dragPicLinkStyle: $('#' + divId).children('div')[0].getAttribute('dragPicLinkStyle'),
                    dragPicFontSize: $('#' + divId).children('div')[0].getAttribute('dragPicFontSize'),
                };
                const divAttributes = Object.entries(dragParams)
                    .map(([param, value]) => ` ${param}="${value}"`)
                    .join("");
                html += `dragHttp.postFromAjax(\`${dragParams.dragPicSql}\`,function(data){
                      var json=JSON.parse(data);
                      var jsonCount=json.length;
                      var option="";
                      var keys=Object.keys(json[0]);
                      var values=Object.values(json[0]);
                      var html=\`<li>
                                      <div id="${divId}" class="draggaugepic handle-resize" >
                                      <div ${divAttributes} style="display:none;" ></div>
                                      <div class="card" style="background-color:${dragParams.dragCardColor}">
                                          <div class="card-header" style="${dragParams.dragPicTitleFont}">
                                              <span class="${dragParams.dragPicTitleBefore}">${dragParams.dragPicTitle}</span>
                                              <a href="javascript:void(0);" onclick="dragConst.tabMenu('${dragParams.dragPicLinkPath}', '${dragParams.dragPicTitle}')" style="${dragParams.dragPicLinkStyle}">${dragParams.dragPicLinkName}</a>
                                          </div>
                                      <div class="card-body">\`;
                      if(jsonCount>0){
                          option = {
                              textStyle: {
                                  fontSize: ${dragParams.dragPicFontSize}
                              },
                              tooltip: {
                                formatter: '{a} <br/>{b} : {c}%'
                              },
                              toolbox: {
                                  show: true,
                                  feature: {
                                    mark: { show: true },
                                    dataView: { show: true, readOnly: false },
                                    restore: { show: true },
                                    saveAsImage: { show: true }
                                  }
                                },
                              series: [
                                {
                                  name: "${dragParams.dragPicTitle}",
                                  type: 'gauge',
                                  detail: {
                                    formatter: '{value}'
                                  },
                                  data: [
                                    {
                                      value: values[0],
                                      name: keys[0]
                                    }
                                  ]
                                }
                              ]
                            };               
                      }
                      html+=\`
                      </div>
                      </div></div>
                      </li>\`; 
                      gridster.add_widget(html,`+ dragwidth + `,` + dragheight + `, ` + col + `,` + row + `);
                      var mydiv = $("#${divId}").children("div").children("div")[1];
                      var myChart = echarts.init(mydiv);
                      myChart.setOption(option);
                      mydiv.setAttribute("myChart_id", myChart.id);
                  });      
                      `;
            }
            if (tagClass == "dragpiepic") {
                var row = $('#' + divId).parent().attr("data-row");
                var col = $('#' + divId).parent().attr("data-col");
                var dragwidth = $('#' + divId).parent().attr("data-sizex");
                var dragheight = $('#' + divId).parent().attr("data-sizey");
                const dragParams = {
                    dragPicTitle: $('#' + divId).children('div')[0].getAttribute('dragPicTitle'),
                    dragPicSql: $('#' + divId).children('div')[0].getAttribute('dragPicSql'),
                    dragPicTime: $('#' + divId).children('div')[0].getAttribute('dragPicTime'),
                    dragCardColor: $('#' + divId).children('div')[0].getAttribute('dragCardColor'),
                    dragPicTitleBefore: $('#' + divId).children('div')[0].getAttribute('dragPicTitleBefore'),
                    dragPicTitleFont: $('#' + divId).children('div')[0].getAttribute('dragPicTitleFont'),
                    dragPicLinkName: $('#' + divId).children('div')[0].getAttribute('dragPicLinkName'),
                    dragPicLinkPath: $('#' + divId).children('div')[0].getAttribute('dragPicLinkPath'),
                    dragPicLinkStyle: $('#' + divId).children('div')[0].getAttribute('dragPicLinkStyle'),
                    dragPicFontSize: $('#' + divId).children('div')[0].getAttribute('dragPicFontSize'),
                };
                const divAttributes = Object.entries(dragParams)
                    .map(([param, value]) => ` ${param}="${value}"`)
                    .join("");
                html += `dragHttp.postFromAjax(\`${dragParams.dragPicSql}\`,function(data){
                      var json=JSON.parse(data);
                      var jsonCount=json.length;
                      var option="";
                      var keys=Object.keys(json[0]);
                      var values=Object.values(json);
                      var datas = $.map(keys, (key) => ({
                          value: values[0][key],
                          name: key
                        }));
                        var html=\`<li>
                                      <div id="${divId}" class="dragpiepic handle-resize" >
                                      <div ${divAttributes} style="display:none;" ></div>
                                      <div class="card" style="background-color:${dragParams.dragCardColor}">
                                          <div class="card-header" style="${dragParams.dragPicTitleFont}">
                                              <span class="${dragParams.dragPicTitleBefore}">${dragParams.dragPicTitle}</span>
                                              <a href="javascript:void(0);" onclick="dragConst.tabMenu('${dragParams.dragPicLinkPath}', '${dragParams.dragPicTitle}')" style="${dragParams.dragPicLinkStyle}">${dragParams.dragPicLinkName}</a>
                                          </div>
                                      <div class="card-body">\`;
                        if(jsonCount>0){
                          option = {
                              textStyle: {
                                  fontSize: ${dragParams.dragPicFontSize}
                              },
                                tooltip: {
                                  trigger: 'item'
                                },
                              legend: {
                                top: 'bottom'
                              },
                              toolbox: {
                                show: true,
                                feature: {
                                  mark: { show: true },
                                  dataView: { show: true, readOnly: false },
                                  restore: { show: true },
                                  saveAsImage: { show: true }
                                }
                              },
                              series: [
                                {
                                  name: "${dragParams.dragPicTitle}",
                                  type: 'pie',
                                  center: ['50%', '50%'],
                                  roseType: 'area',
                                  itemStyle: {
                                    borderRadius: 8
                                  },
                                  data: datas
                                }
                              ]
                            };
          
                      }
                      html+=\`
                      </div>
                      </div></div>
                      </li>\`;   
                      gridster.add_widget(html,`+ dragwidth + `,` + dragheight + `, ` + col + `,` + row + `);
                      var mydiv = $("#${divId}").children("div").children("div")[1];
                      var myChart = echarts.init(mydiv);
                      myChart.setOption(option);
                      mydiv.setAttribute("myChart_id", myChart.id);
                  });  
                  `;
            }
            if (tagClass == "dragbarpic") {
                var row = $('#' + divId).parent().attr("data-row");
                var col = $('#' + divId).parent().attr("data-col");
                var dragwidth = $('#' + divId).parent().attr("data-sizex");
                var dragheight = $('#' + divId).parent().attr("data-sizey");
                const dragParams = {
                    dragPicTitle: $('#' + divId).children('div')[0].getAttribute('dragPicTitle'),
                    dragPicSql: $('#' + divId).children('div')[0].getAttribute('dragPicSql'),
                    dragPicTime: $('#' + divId).children('div')[0].getAttribute('dragPicTime'),
                    dragCardColor: $('#' + divId).children('div')[0].getAttribute('dragCardColor'),
                    dragPicTitleBefore: $('#' + divId).children('div')[0].getAttribute('dragPicTitleBefore'),
                    dragPicTitleFont: $('#' + divId).children('div')[0].getAttribute('dragPicTitleFont'),
                    dragPicLinkName: $('#' + divId).children('div')[0].getAttribute('dragPicLinkName'),
                    dragPicLinkPath: $('#' + divId).children('div')[0].getAttribute('dragPicLinkPath'),
                    dragPicLinkStyle: $('#' + divId).children('div')[0].getAttribute('dragPicLinkStyle'),
                    dragPicFontSize: $('#' + divId).children('div')[0].getAttribute('dragPicFontSize'),
                    dragPicTypes: $('#' + divId).children('div')[0].getAttribute('dragPicTypes'),
                };
                const divAttributes = Object.entries(dragParams)
                    .map(([param, value]) => ` ${param}="${value}"`)
                    .join("");
                html += `dragHttp.postFromAjax(\`${dragParams.dragPicSql}\`,function(data){
                      var json=JSON.parse(data);
                      var jsonCount=json.length;
                      var option="";
                      let legendDatas = Object.keys(json[0]);
                      const values = Object.values(json);
                      const keys = $.map(values, (item) => item[legendDatas[0]]);
                      legendDatas.shift();
                      const getTypes = "${dragParams.dragPicTypes}".split(",");
                      const newArr = dragConst.barTypes.map((value, index) => getTypes[index] || value);
                      const datas = legendDatas.map((key, index) => ({
                          name: key,
                          type: newArr[index],
                          data: json.map(item => item[key])
                      }));
                      var html=\`<li>
                                      <div id="${divId}" class="dragbarpic handle-resize" >
                                      <div ${divAttributes} style="display:none;" ></div>
                                      <div class="card" style="background-color:${dragParams.dragCardColor}">
                                          <div class="card-header" style="${dragParams.dragPicTitleFont}">
                                              <span class="${dragParams.dragPicTitleBefore}">${dragParams.dragPicTitle}</span>
                                              <a href="javascript:void(0);" onclick="dragConst.tabMenu('${dragParams.dragPicLinkPath}', '${dragParams.dragPicTitle}')" style="${dragParams.dragPicLinkStyle}">${dragParams.dragPicLinkName}</a>
                                          </div>
                                      <div class="card-body">\`;
                      if(jsonCount>0){
                          option = {
                              textStyle: {
                                  fontSize: ${dragParams.dragPicFontSize}
                              },
                                toolbox: {
                                  show: true,
                                  feature: {
                                    mark: { show: true },
                                    dataView: { show: true, readOnly: false },
                                    restore: { show: true },
                                    saveAsImage: { show: true }
                                  }
                                },
                              tooltip: {
                                  trigger: 'item'
                                },
                              grid: {
                                left: '3%',
                                right: '4%',
                                bottom: '3%',
                                containLabel: true
                              },
                              legend: {
                                  data: legendDatas
                                },
                              xAxis: [
                                {
                                  type: 'category',
                                  data: keys,
                                  axisTick: {
                                    alignWithLabel: true
                                  }
                                }
                              ],
                              yAxis: [
                                {
                                  type: 'value'
                                }
                              ],
                              series: datas
                            };
                      }
                      html+=\`
                      </div>
                      <div ${divAttributes} style="display:none;" ></div>
                      </div></div>
                      </li>\`;
                      gridster.add_widget(html,`+ dragwidth + `,` + dragheight + `, ` + col + `,` + row + `);
                      var mydiv = $("#${divId}").children("div").children("div")[1];
                      var myChart = echarts.init(mydiv);
                      myChart.setOption(option);
                      mydiv.setAttribute("myChart_id", myChart.id);
                  });
                  `;
            }
            if (tagClass == "draglinepic") {
                var row = $('#' + divId).parent().attr("data-row");
                var col = $('#' + divId).parent().attr("data-col");
                var dragwidth = $('#' + divId).parent().attr("data-sizex");
                var dragheight = $('#' + divId).parent().attr("data-sizey");
                const dragParams = {
                    dragPicTitle: $('#' + divId).children('div')[0].getAttribute('dragPicTitle'),
                    dragPicSql: $('#' + divId).children('div')[0].getAttribute('dragPicSql'),
                    dragPicTime: $('#' + divId).children('div')[0].getAttribute('dragPicTime'),
                    dragCardColor: $('#' + divId).children('div')[0].getAttribute('dragCardColor'),
                    dragPicTitleBefore: $('#' + divId).children('div')[0].getAttribute('dragPicTitleBefore'),
                    dragPicTitleFont: $('#' + divId).children('div')[0].getAttribute('dragPicTitleFont'),
                    dragPicLinkName: $('#' + divId).children('div')[0].getAttribute('dragPicLinkName'),
                    dragPicLinkPath: $('#' + divId).children('div')[0].getAttribute('dragPicLinkPath'),
                    dragPicLinkStyle: $('#' + divId).children('div')[0].getAttribute('dragPicLinkStyle'),
                    dragPicFontSize: $('#' + divId).children('div')[0].getAttribute('dragPicFontSize'),
                    dragPicTypes: $('#' + divId).children('div')[0].getAttribute('dragPicTypes'),
                };
                const divAttributes = Object.entries(dragParams)
                    .map(([param, value]) => ` ${param}="${value}"`)
                    .join("");
                html += `dragHttp.postFromAjax(\`${dragParams.dragPicSql}\`,function(data){
                      var json=JSON.parse(data);
                      var jsonCount=json.length;
                      var option="";
                      let legendDatas = Object.keys(json[0]);
                      const values = Object.values(json);
                      const keys = $.map(values, (item) => item[legendDatas[0]]);
                      legendDatas.shift();
                      const datas = legendDatas.map(key => ({
                          name: key,
                          type: "line",
                          data: json.map(item => item[key])
                      }));
                      var html=\`<li>
                                      <div id="${divId}" class="draglinepic handle-resize" >
                                      <div ${divAttributes} style="display:none;" ></div>
                                      <div class="card" style="background-color:${dragParams.dragCardColor}">
                                          <div class="card-header" style="${dragParams.dragPicTitleFont}">
                                              <span class="${dragParams.dragPicTitleBefore}">${dragParams.dragPicTitle}</span>
                                              <a href="javascript:void(0);" onclick="dragConst.tabMenu('${dragParams.dragPicLinkPath}', '${dragParams.dragPicTitle}')" style="${dragParams.dragPicLinkStyle}">${dragParams.dragPicLinkName}</a>
                                          </div>
                                      <div class="card-body">\`;
                      if(jsonCount>0){
                          option = {
                              textStyle: {
                                  fontSize: ${dragParams.dragPicFontSize}
                              },
                              toolbox: {
                                  show: true,
                                  feature: {
                                    mark: { show: true },
                                    dataView: { show: true, readOnly: false },
                                    restore: { show: true },
                                    saveAsImage: { show: true }
                                  }
                                },
                              tooltip: {
                                trigger: "axis",
                              },
                              legend: {
                                data: legendDatas,
                              },
                              xAxis: {
                                type: "category",
                                boundaryGap: false,
                                data: keys,
                              },
                              yAxis: {
                                type: "value",
                              },
                              series: datas,
                            };
                      }
                      html+=\`
                      </div>
                      </div></div>
                      </li>\`;
                      gridster.add_widget(html,`+ dragwidth + `,` + dragheight + `, ` + col + `,` + row + `);
                      var mydiv = $("#${divId}").children("div").children("div")[1];
                      var myChart = echarts.init(mydiv);
                      myChart.setOption(option);
                      mydiv.setAttribute("myChart_id", myChart.id);
                  });
                  `;
            }
            if (tagClass == "draghidediv") {
                var row = $('#' + divId).parent().attr("data-row");
                var col = $('#' + divId).parent().attr("data-col");
                var dragwidth = $('#' + divId).parent().attr("data-sizex");
                var dragheight = $('#' + divId).parent().attr("data-sizey");
                html += `{
                      var html = \`<li><div id="draghidediv"${divNum} class="draghidediv handle-resize">
                              <div class="card"></div>
                         </div>
                     </li>\`;
              gridster.add_widget(html,`+ dragwidth + `,` + dragheight + `, ` + col + `,` + row + `);
                  }
                  `;
            }
        });

        // 结尾
        html += `
          });
          </script>
        </body>
      </html>
      `;
        $("#inputDragHtml").val(html);
        $('#dragoutputSet').modal('show');
    },
    showDiv: function (showdiv) {
        const title = $('#title').text().trim();
        const titleStyle = $('#title').attr("newstyle");
        var fullHtml = $('html').html();
        var jscssStart = fullHtml.indexOf("<!--jscssstart-->");
        var jscssEnd = fullHtml.indexOf("<!--jscssend-->") + "<!--jscssend-->".length;
        var jscssContent = fullHtml.slice(jscssStart, jscssEnd);
        const bodyStyle = $("#dragBody").attr("style");
        // 开始
        var html = `<!DOCTYPE html>
    <html>
      <head>
          <meta charset="UTF-8">
          <title>${title}</title>
          ${jscssContent}
      </head>
      <body style="${bodyStyle}">
      <div id="title" style="${titleStyle}">
      ${title}
      </div>
      <div class="gridster">
          <ul>`;
        $('.gridster ul li').each(function (index) {
            var divId = $(this).find('.handle-resize').attr('id');
            var tagClass = $('#' + divId).attr('class').split(" ")[0];
            var row = $(this).attr("data-row");
            var col = $(this).attr("data-col");
            var dragwidth = $(this).attr("data-sizex");
            var dragheight = $(this).attr("data-sizey");
            if (tagClass == "draglink") {
                const draglinkImage = $('#' + divId).children('div')[0].getAttribute('draglinkImage');
                const draglinkBG = $('#' + divId).children('div')[0].getAttribute('draglinkBG');
                const draglink = $('#' + divId).children('div')[0].getAttribute('draglink');
                const draglinkTitle = $('#' + divId).children('div')[0].getAttribute('draglinkTitle');
                const draglinkTitleFont = $('#' + divId).children('div')[0].getAttribute('draglinkTitleFont');
                const draglinkStyle = $('#' + divId).children('div')[0].getAttribute('draglinkStyle');
                const draglinkLabel = $('#' + divId).children('div')[0].getAttribute('draglinkLabel');
                const draglinkImageStyle = $('#' + divId).children('div')[0].getAttribute('draglinkImageStyle');
                html += `<li  data-col="${col}" data-row="${row}" data-sizex="${dragwidth}" data-sizey="${dragheight}" class="gs-w" style="display: block; position: absolute;">
                  <div id="${divId}" class="draglink small-box ` + draglinkBG + ` handle-noresize" >
                  <div class="inner">
                      <div class="inner-title" style="${draglinkTitleFont}">${draglinkTitle}</div>
                  </div>
                  <div class="icon" style="${draglinkImageStyle}">
                      <i class="ion ${draglinkImage}"></i>
                  </div>
                  <a onclick="dragConst.tabMenu('${draglink}', '${draglinkTitle}')" href="###" class="small-box-footer" style="${draglinkStyle}">${draglinkLabel}<i class="fa fa-arrow-circle-right"></i></a>
                  </div>
              </li>`;
            }
            else if (tagClass == "dragcardlink") {
                const dragParams = {
                    draglinkImage: $('#' + divId).children('div')[0].getAttribute('draglinkImage'),
                    draglinkImageStyle: $('#' + divId).children('div')[0].getAttribute('draglinkImageStyle'),
                    draglinkTitle: $('#' + divId).children('div')[0].getAttribute('draglinkTitle'),
                    draglinkTitleFont: $('#' + divId).children('div')[0].getAttribute('draglinkTitleFont'),
                    draglink: $('#' + divId).children('div')[0].getAttribute('draglink'),
                    dragCardColor: $('#' + divId).children('div')[0].getAttribute('dragCardColor'),
                };
                html += `<li  data-col="${col}" data-row="${row}" data-sizex="${dragwidth}" data-sizey="${dragheight}" class="gs-w" style="display: block; position: absolute;">
                  <div id="${divId}" class="dragcardlink handle-noresize" >
                  <div class="card" style="background-color:${dragParams.dragCardColor}">
                      <div class="card-body" style="text-align: center;">
                          <a onclick="dragConst.tabMenu('${dragParams.draglink}', '${dragParams.draglinkTitle}')" href="###">
                              <i class="${dragParams.draglinkImage}" style="${dragParams.draglinkImageStyle}"></i>
                              <span style="${dragParams.draglinkTitleFont}">${dragParams.draglinkTitle}</span>
                          </a>
                      </div>
                  </div>
                  </div>
              </li>`;
            }
            else if (tagClass == "draghidediv") {
                html += `<li  data-col="${col}" data-row="${row}" data-sizex="${dragwidth}" data-sizey="${dragheight}" class="gs-w" style="display: block; position: absolute;">
                  <div id="${divId}" class="draghidediv handle-noresize">
                              <div class="dragdivmax"></div>
                  </div>
              </li>`;
            }
            else if (tagClass == "dragonelabel") {
                var draglabelBG = $('#' + divId).children('div')[0].getAttribute('draglabelBG')
                html += `<li  data-col="${col}" data-row="${row}" data-sizex="${dragwidth}" data-sizey="${dragheight}" class="gs-w" style="display: block; position: absolute;">
            <div id="${divId}" class="${tagClass} small-box ${draglabelBG} handle-noresize" >
            </div>
            </li>`;
            }
            else if (tagClass == "dragcardlabel" || tagClass == "dragtable") {
                html += `<li  data-col="${col}" data-row="${row}" data-sizex="${dragwidth}" data-sizey="${dragheight}" class="gs-w" style="display: block; position: absolute;">
            <div id="${divId}" class="${tagClass} handle-noresize" >
            </div>
            </li>`;
            }
            else {
                //需要动态加载
                const dragCardColor = $('#' + divId).children('div')[0].getAttribute('dragCardColor');
                const dragPicTitle = $('#' + divId).children('div')[0].getAttribute('dragPicTitle');
                const dragPicTitleBefore = $('#' + divId).children('div')[0].getAttribute('dragPicTitleBefore');
                const dragPicTitleFont = $('#' + divId).children('div')[0].getAttribute('dragPicTitleFont');
                const dragPicLinkName = $('#' + divId).children('div')[0].getAttribute('dragPicLinkName');
                const dragPicLinkPath = $('#' + divId).children('div')[0].getAttribute('dragPicLinkPath');
                const dragPicLinkStyle = $('#' + divId).children('div')[0].getAttribute('dragPicLinkStyle');
                html += `<li  data-col="${col}" data-row="${row}" data-sizex="${dragwidth}" data-sizey="${dragheight}" class="gs-w" style="display: block; position: absolute;">
            <div id="${divId}" class="${tagClass} handle-noresize" >
            <div class="card" style="background-color:${dragCardColor}">
                <div class="card-header" style="${dragPicTitleFont}">
                    <span class="${dragPicTitleBefore}">${dragPicTitle}</span>
                    <a href="javascript:void(0);" onclick="dragConst.tabMenu('${dragPicLinkPath}', '${dragPicTitle}')" style="${dragPicLinkStyle}">${dragPicLinkName}</a>
                </div>
            <div class="card-body">
            </div></div>
            </div>
            </li>`;
            }
        });
        html += `</ul>
      </div>
      <script type="text/javascript">
    $(document).ready(function(){
      `;

        $('.gridster ul li').each(function (index) {
            var divId = $(this).find('.handle-resize').attr('id');
            var tagClass = $('#' + divId).attr('class').split(" ")[0];
            if (tagClass == "dragonelabel") {
                const draglabelParams = {
                    draglabelTitleFont: $('#' + divId).children('div')[0].getAttribute('draglabelTitleFont'),
                    draglabelCountFont: $('#' + divId).children('div')[0].getAttribute('draglabelCountFont'),
                    draglabelLink: $('#' + divId).children('div')[0].getAttribute('draglabelLink'),
                    draglabelLinkTitle: $('#' + divId).children('div')[0].getAttribute('draglabelLinkTitle'),
                    draglabelLinkFont: $('#' + divId).children('div')[0].getAttribute('draglabelLinkFont'),
                    draglabelSql: $('#' + divId).children('div')[0].getAttribute('draglabelSql'),
                    draglabelImage: $('#' + divId).children('div')[0].getAttribute('draglabelImage'),
                    draglabelTime: $('#' + divId).children('div')[0].getAttribute('draglabelTime'),
                    draglabelImageStyle: $('#' + divId).children('div')[0].getAttribute('draglabelImageStyle'),
                };
                html += `dragHttp.postFromAjax(\`${draglabelParams.draglabelSql}\`,function(data){
            var json=JSON.parse(data);
            var jsonCount=json.length;
            var keys=Object.keys(json[0]);
            var values=Object.values(json[0]);
            var html="";
            if(jsonCount>0){
                  html += \`<div class="inner"><div class="inner-count" style="${draglabelParams.draglabelCountFont}">\${values[0]}</div>
                  <div class="inner-title" style="${draglabelParams.draglabelTitleFont}">\${keys[0]}</div></div>\`;
                  html += \`<div class="icon" style="${draglabelParams.draglabelImageStyle}">
                  <i class="ion ${draglabelParams.draglabelImage}"></i>
                  </div>\`;
                  html += \`<a onclick="dragConst.tabMenu('${draglabelParams.draglabelLink}', '${draglabelParams.draglabelLinkTitle}')" class="small-box-footer" href="###" style="${draglabelParams.draglabelLinkFont}">${draglabelParams.draglabelLinkTitle}<i class="fa fa-arrow-circle-right"></i></a>\`;
                  html+=\`</div>\`;
            }
            var tempDiv = document.createElement('div');
            tempDiv.innerHTML = html; 
            document.getElementById("${divId}").appendChild(tempDiv);
            });
            dragDivChange.setIntervalDiv(\`${divId}\`,${draglabelParams.draglabelTime},\`${draglabelParams.draglabelSql}\`,"");
            `;
            }
            if (tagClass == "dragcardlabel") {
                const draglabelParams = {
                    draglabelTitleFont: $('#' + divId).children('div')[0].getAttribute('draglabelTitleFont'),
                    draglabelCountFont: $('#' + divId).children('div')[0].getAttribute('draglabelCountFont'),
                    draglabelTitle2Font: $('#' + divId).children('div')[0].getAttribute('draglabelTitle2Font'),
                    draglabelCount2Font: $('#' + divId).children('div')[0].getAttribute('draglabelCount2Font'),
                    draglabelSql: $('#' + divId).children('div')[0].getAttribute('draglabelSql'),
                    draglabelImage: $('#' + divId).children('div')[0].getAttribute('draglabelImage'),
                    draglabelBG: $('#' + divId).children('div')[0].getAttribute('draglabelBG'),
                    draglabelTime: $('#' + divId).children('div')[0].getAttribute('draglabelTime'),
                    dragCardColor: $('#' + divId).children('div')[0].getAttribute('dragCardColor'),
                    draglabelImageStyle: $('#' + divId).children('div')[0].getAttribute('draglabelImageStyle'),
                };
                const strs = draglabelParams.draglabelImageStyle.split(";");
                const draglabelImageSize = strs[0].split(":")[1].replace("px", "");
                const draglabelImageDivSize = draglabelImageSize * 1.25;
                const ImageDivStyle1 = `border-radius:${draglabelImageDivSize}px;width:${draglabelImageDivSize}px;height:${draglabelImageDivSize}px;line-height:${draglabelImageDivSize}px;`;
                const ImageDivStyle2 = `font-size: ${draglabelImageSize}px;`;
                html += `dragHttp.postFromAjax(\`${draglabelParams.draglabelSql}\`,function(data){
            var json=JSON.parse(data);
            var jsonCount=json.length;
            var keys=Object.keys(json[0]);
            var values=Object.values(json[0]);
            var html="";
            if(jsonCount>0){
                  html += \`<div class="card-body">
                  <div class="row"><div class="col">
                      <h3 style="${draglabelParams.draglabelCountFont}" class="mb-2 fw-semibold">\${dragConst.addThousandSeparator(values[0])}</h3>
                      <p style="${draglabelParams.draglabelTitleFont}" class="text-muted fs-15 mb-0">\${keys[0]}</p>\`;
                  if (keys.length > 1) {
                      html += \`
                      <p style="${draglabelParams.draglabelTitle2Font}" class="text-muted mb-0 mt-2 fs-12">
                          <span style="${draglabelParams.draglabelCount2Font}" class="icn-box text-success fw-semibold fs-15 me-1">
                              \${dragConst.addThousandSeparator(values[1])}</span>
                              \${keys[1]} </p>\`;
                  }
                  html += \`
                          </div>
                          <div class="col col-auto top-icn" style="${ImageDivStyle2}">
                              <div class="counter-icon ${draglabelParams.draglabelBG} dash ms-auto box-shadow-primary" style="${ImageDivStyle1}">
                                  <i class="ion ${draglabelParams.draglabelImage}" style="${draglabelParams.draglabelImageStyle}"></i>
                              </div>
                          </div>
                  </div>
                  </div>
               </div>\`;
            }
            var tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;
            tempDiv.setAttribute("class","card");
            tempDiv.setAttribute("style", "background-color:${draglabelParams.dragCardColor}");
            document.getElementById("${divId}").appendChild(tempDiv);
            });
            dragDivChange.setIntervalDiv(\`${divId}\`,${draglabelParams.draglabelTime},\`${draglabelParams.draglabelSql}\`,"");
            `;
            }
            if (tagClass == "draglabel") {
                var draglabelTitle = $('#' + divId).children('div')[0].getAttribute('draglabelTitle');
                var draglabelTitleFont = $('#' + divId).children('div')[0].getAttribute('draglabelTitleFont');
                var draglabelCTitleFont = $('#' + divId).children('div')[0].getAttribute('draglabelCTitleFont');
                var draglabelCCountFont = $('#' + divId).children('div')[0].getAttribute('draglabelCCountFont');
                var draglabelCLinkFont = $('#' + divId).children('div')[0].getAttribute('draglabelCLinkFont');
                var sql = $('#' + divId).children('div')[0].getAttribute('draglabelSql');
                html += `dragHttp.postFromAjax(\`` + sql + `\`,function(data){
                var json=JSON.parse(data);
                var jsonCount=json.length;
                var keys=Object.keys(json[0]);
                var values=Object.values(json[0]);
                var percentage=100/keys.length;
                var urls="";
                var html="";
                html+=\`<div style="`+ draglabelTitleFont + `">` + draglabelTitle + `</div>\`;
                if(jsonCount>1){
                    urls=Object.values(json[1]);
                }
                for(var x=0;x<keys.length;x++){
                    html+=\`
                    <div style="width: \`+percentage+\`%; height: 100%; float: left">
            <div style="`+ draglabelCTitleFont + `">\`+keys[x]+\`</div>
            <div style="`+ draglabelCCountFont + `">\`+values[x]+\`</div>\`
            if(urls!=""&&urls[x]!=""&&urls[x]!=" "){
                html+=\`<a target="_blank" href="\`+urls[x]+\`" style="`+ draglabelCLinkFont + `">\`+keys[x]+\`</a>\`;
            }
            html+=\`</div>\`;
        }
        var tempDiv = document.createElement('div');
        tempDiv.innerHTML = html; 
        document.getElementById("${divId}").appendChild(tempDiv);
    });
    `;
            }
            if (tagClass == "dragtable") {
                const dragtableTitle = $('#' + divId).children('div')[0].getAttribute('dragtableTitle');
                const dragtableTitleFont = $('#' + divId).children('div')[0].getAttribute('dragtableTitleFont');
                const dragtableSql = $('#' + divId).children('div')[0].getAttribute('dragtableSql');
                const dragtableTime = $('#' + divId).children('div')[0].getAttribute('dragtableTime');
                const dragCardColor = $('#' + divId).children('div')[0].getAttribute('dragCardColor');
                const dragtableTitleBefore = $('#' + divId).children('div')[0].getAttribute('dragtableTitleBefore');
                const dragtableType = $('#' + divId).children('div')[0].getAttribute('dragtableType');
                const dragtableLinkName = $('#' + divId).children('div')[0].getAttribute('dragtableLinkName');
                const dragtableLinkPath = $('#' + divId).children('div')[0].getAttribute('dragtableLinkPath');
                const dragtableLinkStyle = $('#' + divId).children('div')[0].getAttribute('dragtableLinkStyle');
                const dragtableTheadStyle = $('#' + divId).children('div')[0].getAttribute('dragtableTheadStyle');
                const dragtableTbodyStyle = $('#' + divId).children('div')[0].getAttribute('dragtableTbodyStyle');
                html += `dragHttp.postFromAjax(\`${dragtableSql}\`,function(data){
                var json=JSON.parse(data);
                var jsonCount=json.length;
                var keys=Object.keys(json[0]);
                var values=Object.values(json);
                var html="";
                if(jsonCount>0){
                    html += \`<div class="card-header" style="${dragtableTitleFont}">
                                  <span class="${dragtableTitleBefore}">${dragtableTitle}</span>
                                  <a href="javascript:void(0);" onclick="dragConst.tabMenu('${dragtableLinkPath}', '${dragtableTitle}')" style="${dragtableLinkStyle}">${dragtableLinkName}</a>
                              </div>\`;
                    html += \`<div class="card-body">\`;
                    html+=\`<div class="tableScroll"><table class="${dragtableType}">\`;
                    html+=\`<thead class="theadsticky" style="background-color:${dragCardColor};"><tr>\`;
                    for(var x=0;x<keys.length;x++){
                        html+=\`<th style="${dragtableTheadStyle}">\`+keys[x]+\`</th>\`;
                    }
                    html+=\`</tr></thead>\`;
                    html+=\`<tbody>\`;
                    for(var x=0;x<values.length;x++){
                        html+="<tr>";
                        for(var y=0;y<keys.length;y++){
                            html+=\`<td style="${dragtableTbodyStyle}">\`+values[x][keys[y]]+\`</td>\`;
                        }
                        html+=\`</tr>\`;
                    }
                    html+=\`</tbody>\`;
                    html+=\`<tbody class="tbody2"></tbody></table></div></div>\`;
                }
                var tempDiv = document.createElement('div');
                tempDiv.innerHTML = html;
                tempDiv.setAttribute('class', 'card');
                tempDiv.setAttribute("style", \`background-color:${dragCardColor};\`);
                document.getElementById("${divId}").appendChild(tempDiv);
                dragScroll.autoScroll(\`${divId}\`);
            });
            dragDivChange.setIntervalDiv(\`${divId}\`,${dragtableTime},\`${dragtableSql}\`,"");
            `;
            }
            if (tagClass == "draggaugepic") {
                var dragPicTitle = $('#' + divId).children('div')[0].getAttribute('dragPicTitle');
                var dragPicSql = $('#' + divId).children('div')[0].getAttribute('dragPicSql');
                var dragPicTime = $('#' + divId).children('div')[0].getAttribute('dragPicTime');
                const dragPicFontSize = $('#' + divId).children('div')[0].getAttribute('dragPicFontSize');
                html += `dragHttp.postFromAjax(\`${dragPicSql}\`,function(data){
                var json=JSON.parse(data);
                var jsonCount=json.length;
                var option="";
                var keys=Object.keys(json[0]);
                var values=Object.values(json[0]);
                if(jsonCount>0){
                    option = {
                       textStyle: {
                           fontSize: ${dragPicFontSize}
                        },
                        tooltip: {
                          formatter: '{a} <br/>{b} : {c}%'
                        },
                        toolbox: {
                            show: true,
                            feature: {
                              mark: { show: true },
                              dataView: { show: true, readOnly: false },
                              restore: { show: true },
                              saveAsImage: { show: true }
                            }
                          },
                        series: [
                          {
                            name: "${dragPicTitle}",
                            type: 'gauge',
                            detail: {
                              formatter: '{value}'
                            },
                            data: [
                              {
                                value: values[0],
                                name: keys[0]
                              }
                            ]
                          }
                        ]
                      };               
                }
                var mydiv = $("#${divId}").children("div").children("div")[1];
                var myChart = echarts.init(mydiv);
                myChart.setOption(option);
                mydiv.setAttribute("myChart_id", myChart.id);
            });
            dragDivChange.setIntervalDiv(\`${divId}\`,${dragPicTime},\`${dragPicSql}\`,"");
                `;
            }
            if (tagClass == "dragpiepic") {
                var dragPicTitle = $('#' + divId).children('div')[0].getAttribute('dragPicTitle');
                var dragPicSql = $('#' + divId).children('div')[0].getAttribute('dragPicSql');
                var dragPicTime = $('#' + divId).children('div')[0].getAttribute('dragPicTime');
                const dragPicFontSize = $('#' + divId).children('div')[0].getAttribute('dragPicFontSize');
                html += `dragHttp.postFromAjax(\`${dragPicSql}\`,function(data){
                var json=JSON.parse(data);
                var jsonCount=json.length;
                var option="";
                var keys=Object.keys(json[0]);
                var values=Object.values(json);
                var datas = $.map(keys, (key) => ({
                    value: values[0][key],
                    name: key
                  }));
                  if(jsonCount>0){
                    option = {
                       textStyle: {
                           fontSize: ${dragPicFontSize}
                        },
                          tooltip: {
                            trigger: 'item'
                          },
                        legend: {
                          top: 'bottom'
                        },
                        toolbox: {
                          show: true,
                          feature: {
                            mark: { show: true },
                            dataView: { show: true, readOnly: false },
                            restore: { show: true },
                            saveAsImage: { show: true }
                          }
                        },
                        series: [
                          {
                            name: "${dragPicTitle}",
                            type: 'pie',
                            center: ['50%', '50%'],
                            roseType: 'area',
                            itemStyle: {
                              borderRadius: 8
                            },
                            data: datas
                          }
                        ]
                      };
    
                }
                var mydiv = $("#${divId}").children("div").children("div")[1];
                var myChart = echarts.init(mydiv);
                myChart.setOption(option);
                mydiv.setAttribute("myChart_id", myChart.id);
            });
            dragDivChange.setIntervalDiv(\`${divId}\`,${dragPicTime},\`${dragPicSql}\`,"");
            `;
            }
            if (tagClass == "dragbarpic") {
                var dragPicTitle = $('#' + divId).children('div')[0].getAttribute('dragPicTitle');
                var dragPicSql = $('#' + divId).children('div')[0].getAttribute('dragPicSql');
                var dragPicTime = $('#' + divId).children('div')[0].getAttribute('dragPicTime');
                const dragPicFontSize = $('#' + divId).children('div')[0].getAttribute('dragPicFontSize');
                const dragPicTypes = $('#' + divId).children('div')[0].getAttribute('dragPicTypes');
                html += `dragHttp.postFromAjax(\`${dragPicSql}\`,function(data){
                var json=JSON.parse(data);
                var jsonCount=json.length;
                var option="";
                let legendDatas = Object.keys(json[0]);
                const values = Object.values(json);
                const keys = $.map(values, (item) => item[legendDatas[0]]);
                legendDatas.shift();
                const getTypes = "${dragPicTypes}".split(",");
                const newArr = dragConst.barTypes.map((value, index) => getTypes[index] || value);
                const datas = legendDatas.map((key, index) => ({
                    name: key,
                    type: newArr[index],
                    data: json.map(item => item[key])
                }));
                if(jsonCount>0){
                    option = {
                       textStyle: {
                           fontSize: ${dragPicFontSize}
                        },
                          toolbox: {
                            show: true,
                            feature: {
                              mark: { show: true },
                              dataView: { show: true, readOnly: false },
                              restore: { show: true },
                              saveAsImage: { show: true }
                            }
                          },
                        tooltip: {
                            trigger: 'item'
                          },
                        grid: {
                          left: '3%',
                          right: '4%',
                          bottom: '3%',
                          containLabel: true
                        },
                        legend: {
                            data: legendDatas
                          },
                        xAxis: [
                          {
                            type: 'category',
                            data: keys,
                            axisTick: {
                              alignWithLabel: true
                            }
                          }
                        ],
                        yAxis: [
                          {
                            type: 'value'
                          }
                        ],
                        series: datas
                      };
                }
                var mydiv = $("#${divId}").children("div").children("div")[1];
                var myChart = echarts.init(mydiv);
                myChart.setOption(option);
                mydiv.setAttribute("myChart_id", myChart.id);
            });
            dragDivChange.setIntervalDiv(\`${divId}\`,${dragPicTime},\`${dragPicSql}\`,\`${dragPicTypes}\`);
            `;
            }
            if (tagClass == "draglinepic") {
                var dragPicTitle = $('#' + divId).children('div')[0].getAttribute('dragPicTitle');
                var dragPicSql = $('#' + divId).children('div')[0].getAttribute('dragPicSql');
                var dragPicTime = $('#' + divId).children('div')[0].getAttribute('dragPicTime');
                const dragPicFontSize = $('#' + divId).children('div')[0].getAttribute('dragPicFontSize');
                const dragPicTypes = $('#' + divId).children('div')[0].getAttribute('dragPicTypes');
                html += `dragHttp.postFromAjax(\`${dragPicSql}\`,function(data){
                var json=JSON.parse(data);
                var jsonCount=json.length;
                var option="";
                let legendDatas = Object.keys(json[0]);
                const values = Object.values(json);
                const keys = $.map(values, (item) => item[legendDatas[0]]);
                legendDatas.shift();
                const datas = legendDatas.map(key => ({
                  name: key,
                  type: "line",
                  data: json.map(item => item[key])
                }));
                if(jsonCount>0){
                    option = {
                       textStyle: {
                           fontSize: ${dragPicFontSize}
                        },
                        toolbox: {
                            show: true,
                            feature: {
                              mark: { show: true },
                              dataView: { show: true, readOnly: false },
                              restore: { show: true },
                              saveAsImage: { show: true }
                            }
                          },
                        tooltip: {
                          trigger: "axis",
                        },
                        legend: {
                          data: legendDatas,
                        },
                        xAxis: {
                          type: "category",
                          boundaryGap: false,
                          data: keys,
                        },
                        yAxis: {
                          type: "value",
                        },
                        series: datas,
                      };
                }
                var mydiv = $("#${divId}").children("div").children("div")[1];
                var myChart = echarts.init(mydiv);
                myChart.setOption(option);
                mydiv.setAttribute("myChart_id", myChart.id);
            });
            dragDivChange.setIntervalDiv(\`${divId}\`,${dragPicTime},\`${dragPicSql}\`,\`${dragPicTypes}\`);
            `;
            }
        });

        // 结尾
        html += `
    gridster.disable_resize();
    gridster.disable();
    });
    </script>
    </body>
  </html>
  `;
        $("#inputDragHtml").val(html);
        if (showdiv) {
            $('#dragoutputSet').modal('show');
        }
    },
    saveData: function () {
        const title = $('#title').text().trim();
        const titleStyle = $('#title').attr("style");
        const titleNewStyle = $('#title').attr("newstyle");
        const id = $("#inputDragId").val();
        const bodyStyle = $("#dragBody").attr("style");
        dragOutPutHtml.showDiv();
        var showHtml = $("#inputDragHtml").val();
        var html = `<script type="text/javascript">
              $(document).ready(function(){
              $('#title').attr("style","${titleStyle}");
              $('#title').attr("newstyle","${titleNewStyle}");
              $('#dragBody').attr("style","${bodyStyle}");
            `;
        // 加载布置的div
        $('.gridster ul li').each(function (index) {
            var divId = $(this).find('.handle-resize').attr('id');
            var tagClass = $('#' + divId).attr('class').split(" ")[0];
            if (tagClass == "dragonelabel") {
                var row = $('#' + divId).parent().attr("data-row");
                var col = $('#' + divId).parent().attr("data-col");
                var dragwidth = $('#' + divId).parent().attr("data-sizex");
                var dragheight = $('#' + divId).parent().attr("data-sizey");
                const draglabelParams = {
                    draglabelTitleFont: $('#' + divId).children('div')[0].getAttribute('draglabelTitleFont'),
                    draglabelCountFont: $('#' + divId).children('div')[0].getAttribute('draglabelCountFont'),
                    draglabelLink: $('#' + divId).children('div')[0].getAttribute('draglabelLink'),
                    draglabelLinkTitle: $('#' + divId).children('div')[0].getAttribute('draglabelLinkTitle'),
                    draglabelLinkFont: $('#' + divId).children('div')[0].getAttribute('draglabelLinkFont'),
                    draglabelSql: $('#' + divId).children('div')[0].getAttribute('draglabelSql'),
                    draglabelImage: $('#' + divId).children('div')[0].getAttribute('draglabelImage'),
                    draglabelBG: $('#' + divId).children('div')[0].getAttribute('draglabelBG'),
                    draglabelTime: $('#' + divId).children('div')[0].getAttribute('draglabelTime'),
                    draglabelImageStyle: $('#' + divId).children('div')[0].getAttribute('draglabelImageStyle'),
                };
                const htmlAttributes = Object.entries(draglabelParams)
                    .map(([param, value]) => ` ${param}="${value}"`)
                    .join("");
                html += `dragHttp.postFromAjax(\`` + draglabelParams.draglabelSql + `\`,function(data){
                  var json=JSON.parse(data);
                  var jsonCount=json.length;
                  var keys=Object.keys(json[0]);
                  var values=Object.values(json[0]);
                  var html=\`<li><div id="`+ divId + `" class="dragonelabel small-box ${draglabelParams.draglabelBG} handle-resize" >\`;
                  if(jsonCount>0){
                      html+=\`<div ${htmlAttributes}
                      style="display:none;" ></div>\`;
                      html += \`<div><div class="inner"><div class="inner-count" style="` + draglabelParams.draglabelCountFont + `">\` + values[0] + \`</div>
                      <div class="inner-title" style="`+ draglabelParams.draglabelTitleFont + `">\` + keys[0] + \`</div></div>\`;
                      html += \`<div class="icon" style="${draglabelParams.draglabelImageStyle}">
                      <i class="ion ${draglabelParams.draglabelImage}"></i>
                      </div>\`;
                      html += \`<a onclick="dragConst.tabMenu('${draglabelParams.draglabelLink}', '${draglabelParams.draglabelLinkTitle}')" class="small-box-footer" href="###" style="` + draglabelParams.draglabelLinkFont + `">` + draglabelParams.draglabelLinkTitle + `<i class="fa fa-arrow-circle-right"></i></a>\`;
                      html+=\`</div>\`;
                  }
                  html+=\`
                  </div>
                  </li>\`;
                  gridster.add_widget(html,`+ dragwidth + `,` + dragheight + `, ` + col + `,` + row + `);
                  });
                  `;
            }
            if (tagClass == "dragcardlabel") {
                var row = $('#' + divId).parent().attr("data-row");
                var col = $('#' + divId).parent().attr("data-col");
                var dragwidth = $('#' + divId).parent().attr("data-sizex");
                var dragheight = $('#' + divId).parent().attr("data-sizey");
                const draglabelParams = {
                    draglabelTitleFont: $('#' + divId).children('div')[0].getAttribute('draglabelTitleFont'),
                    draglabelCountFont: $('#' + divId).children('div')[0].getAttribute('draglabelCountFont'),
                    draglabelTitle2Font: $('#' + divId).children('div')[0].getAttribute('draglabelTitle2Font'),
                    draglabelCount2Font: $('#' + divId).children('div')[0].getAttribute('draglabelCount2Font'),
                    draglabelSql: $('#' + divId).children('div')[0].getAttribute('draglabelSql'),
                    draglabelImage: $('#' + divId).children('div')[0].getAttribute('draglabelImage'),
                    draglabelBG: $('#' + divId).children('div')[0].getAttribute('draglabelBG'),
                    draglabelTime: $('#' + divId).children('div')[0].getAttribute('draglabelTime'),
                    dragCardColor: $('#' + divId).children('div')[0].getAttribute('dragCardColor'),
                    draglabelImageStyle: $('#' + divId).children('div')[0].getAttribute('draglabelImageStyle'),
                };
                const strs = draglabelParams.draglabelImageStyle.split(";");
                const draglabelImageSize = strs[0].split(":")[1].replace("px", "");
                const draglabelImageDivSize = draglabelImageSize * 1.25;
                const ImageDivStyle1 = `border-radius:${draglabelImageDivSize}px;width:${draglabelImageDivSize}px;height:${draglabelImageDivSize}px;line-height:${draglabelImageDivSize}px;`;
                const ImageDivStyle2 = `font-size: ${draglabelImageSize}px;`;
                const htmlAttributes = Object.entries(draglabelParams)
                    .map(([param, value]) => ` ${param}="${value}"`)
                    .join("");
                html += `dragHttp.postFromAjax(\`` + draglabelParams.draglabelSql + `\`,function(data){
                  var json=JSON.parse(data);
                  var jsonCount=json.length;
                  var keys=Object.keys(json[0]);
                  var values=Object.values(json[0]);
                  var html=\`<li><div id="${divId}" class="dragcardlabel handle-resize" >\`;
                  if(jsonCount>0){
                      html+=\`<div ${htmlAttributes}
                      style="display:none;" ></div>\`;
                      html += \`<div class="card" style="background-color:${draglabelParams.dragCardColor};"> <div class="card-body">
                        <div class="row"><div class="col">
                            <h3 style="${draglabelParams.draglabelCountFont}" class="mb-2 fw-semibold">\${dragConst.addThousandSeparator(values[0])}</h3>
                            <p style="${draglabelParams.draglabelTitleFont}" class="text-muted fs-15 mb-0">\${keys[0]}</p>\`;
                      if (keys.length >1) {
                                html += \`
                      <p style="${draglabelParams.draglabelTitle2Font}" class="text-muted mb-0 mt-2 fs-12">
                          <span style="${draglabelParams.draglabelCount2Font}" class="icn-box text-success fw-semibold fs-15 me-1">
                              \${dragConst.addThousandSeparator(values[1])}</span>
                              \${keys[1]} </p>\`;
                        }
                            html += \`
                        </div>
                            <div class="col col-auto top-icn" style="${ImageDivStyle2}">
                                <div class="counter-icon ${draglabelParams.draglabelBG} dash ms-auto box-shadow-primary" style="${ImageDivStyle1}">
                                    <i class="ion ${draglabelParams.draglabelImage}" style="${draglabelParams.draglabelImageStyle}"></i>
                                </div>
                            </div>
                        </div>
                    </div>\`;
                  }
                  html+=\`
                  </div>
                  </li>\`;
                  gridster.add_widget(html,${dragwidth},${dragheight}, ${col},${row});
                  });
                  `;
            }
            if (tagClass == "draglabel") {
                var row = $('#' + divId).parent().parent().parent().attr("data-row");
                var col = $('#' + divId).parent().parent().parent().attr("data-col");
                var dragwidth = $('#' + divId).parent().parent().parent().attr("data-sizex");
                var dragheight = $('#' + divId).parent().parent().parent().attr("data-sizey");
                var draglabelTitle = $('#' + divId).children('div')[0].getAttribute('draglabelTitle');
                var draglabelTitleFont = $('#' + divId).children('div')[0].getAttribute('draglabelTitleFont');
                var draglabelCTitleFont = $('#' + divId).children('div')[0].getAttribute('draglabelCTitleFont');
                var draglabelCCountFont = $('#' + divId).children('div')[0].getAttribute('draglabelCCountFont');
                var draglabelCLinkFont = $('#' + divId).children('div')[0].getAttribute('draglabelCLinkFont');
                var sql = $('#' + divId).children('div')[0].getAttribute('draglabelSql');
                html += `dragHttp.postFromAjax(\`` + sql + `\`,function(data){
                      var json=JSON.parse(data);
                      var jsonCount=json.length;
                      var keys=Object.keys(json[0]);
                      var values=Object.values(json[0]);
                      var percentage=100/keys.length;
                      var urls="";
                      var html=\`<li><div class="card"><div class="card-body"><div id="`+ divId + `" class="draglabel handle-resize" >\`;
                      html+=\`<div draglabelSql="`+ sql + `" draglabelTitle="` + draglabelTitle + `" 
                      draglabelTitleFont="`+ draglabelTitleFont + `" draglabelCTitleFont="` + draglabelCTitleFont + `" 
                      draglabelCCountFont="`+ draglabelCCountFont + `" draglabelCLinkFont="` + draglabelCLinkFont + `"
                      style="display:none;" ></div>\`;
                      html+=\`<div style="`+ draglabelTitleFont + `">` + draglabelTitle + `</div>\`;
                      if(jsonCount>1){
                          urls=Object.values(json[1]);
                      }
                      for(var x=0;x<keys.length;x++){
                          html+=\`
                          <div style="width: \`+percentage+\`%; height: 100%; float: left">
                  <div style="`+ draglabelCTitleFont + `">\`+keys[x]+\`</div>
                  <div style="`+ draglabelCCountFont + `">\`+values[x]+\`</div>\`
                  if(urls!=""&&urls[x]!=""&&urls[x]!=" "){
                      html+=\`<a target="_blank" href="\`+urls[x]+\`" style="`+ draglabelCLinkFont + `">\`+keys[x]+\`</a>\`;
                  }
                  html+=\`</div>\`;
              }
              html+=\`
              </div>
              </div></div>
              </li>\`;
              gridster.add_widget(html,`+ dragwidth + `,` + dragheight + `, ` + col + `,` + row + `);
          });
          `;
            }
            if (tagClass == "draglink") {
                var row = $('#' + divId).parent().attr("data-row");
                var col = $('#' + divId).parent().attr("data-col");
                var dragwidth = $('#' + divId).parent().attr("data-sizex");
                var dragheight = $('#' + divId).parent().attr("data-sizey");
                const dragParams = {
                    draglinkImage: $('#' + divId).children('div')[0].getAttribute('draglinkImage'),
                    draglinkBG: $('#' + divId).children('div')[0].getAttribute('draglinkBG'),
                    draglink: $('#' + divId).children('div')[0].getAttribute('draglink'),
                    draglinkTitle: $('#' + divId).children('div')[0].getAttribute('draglinkTitle'),
                    draglinkTitleFont: $('#' + divId).children('div')[0].getAttribute('draglinkTitleFont'),
                    draglinkStyle: $('#' + divId).children('div')[0].getAttribute('draglinkStyle'),
                    draglinkLabel: $('#' + divId).children('div')[0].getAttribute('draglinkLabel'),
                    draglinkImageStyle: $('#' + divId).children('div')[0].getAttribute('draglinkImageStyle'),
                };
                const divAttributes = Object.entries(dragParams)
                    .map(([param, value]) => ` ${param}="${value}"`)
                    .join("");
                html += `{
                      var html=\`<li><div id="` + divId + `" class="draglink small-box ` + dragParams.draglinkBG + ` handle-resize" >\`;
                      html += \`<div ${divAttributes} style="display:none;" ></div>
                  <div>
                  <div class="inner">
                      <div class="inner-title" style="`+ dragParams.draglinkTitleFont + `">` + dragParams.draglinkTitle + `</div>
                  </div>
                  <div class="icon" style="${dragParams.draglinkImageStyle}">
                      <i class="ion `+ dragParams.draglinkImage + `"></i>
                  </div>
                  <a onclick="dragConst.tabMenu('${dragParams.draglink}', '${dragParams.draglinkTitle}')" href="###" class="small-box-footer" style="` + dragParams.draglinkStyle + `">` + dragParams.draglinkLabel + ` <i class="fa fa-arrow-circle-right"></i></a>
                  </div>
                  </div>
              </li >\`;
              gridster.add_widget(html,`+ dragwidth + `,` + dragheight + `, ` + col + `,` + row + `);
                  }
                  `;
            }
            if (tagClass == "dragcardlink") {
                var row = $('#' + divId).parent().attr("data-row");
                var col = $('#' + divId).parent().attr("data-col");
                var dragwidth = $('#' + divId).parent().attr("data-sizex");
                var dragheight = $('#' + divId).parent().attr("data-sizey");
                const dragParams = {
                    draglinkImage: $('#' + divId).children('div')[0].getAttribute('draglinkImage'),
                    draglinkImageStyle: $('#' + divId).children('div')[0].getAttribute('draglinkImageStyle'),
                    draglinkTitle: $('#' + divId).children('div')[0].getAttribute('draglinkTitle'),
                    draglinkTitleFont: $('#' + divId).children('div')[0].getAttribute('draglinkTitleFont'),
                    draglink: $('#' + divId).children('div')[0].getAttribute('draglink'),
                    dragCardColor: $('#' + divId).children('div')[0].getAttribute('dragCardColor'),
                };
                const divAttributes = Object.entries(dragParams)
                    .map(([param, value]) => ` ${param}="${value}"`)
                    .join("");
                html += `{
                      var html = \`<li><div id="${divId}" class="dragcardlink handle-resize" >\`;
          html += \`<div ${divAttributes} style="display:none;" ></div>\`;
          html += \`<div class="card" style="background-color:${dragParams.dragCardColor};">
                      <div class="card-body" style="text-align: center;">
                          <a onclick="dragConst.tabMenu('${dragParams.draglink}', '${dragParams.draglinkTitle}')" href="###">
                              <i class="${dragParams.draglinkImage}" style="${dragParams.draglinkImageStyle}"></i>
                              <span style="${dragParams.draglinkTitleFont}">${dragParams.draglinkTitle}</span>
                          </a>
                      </div>
                  </div>
              \`;
          html += \`
          </div>
          </li>\`;
              gridster.add_widget(html,`+ dragwidth + `,` + dragheight + `, ` + col + `,` + row + `);
                  }
                  `;
            }
            if (tagClass == "dragtable") {
                var row = $('#' + divId).parent().attr("data-row");
                var col = $('#' + divId).parent().attr("data-col");
                var dragwidth = $('#' + divId).parent().attr("data-sizex");
                var dragheight = $('#' + divId).parent().attr("data-sizey");
                const dragParams = {
                    dragtableTitle: $('#' + divId).children('div')[0].getAttribute('dragtableTitle'),
                    dragtableTitleFont: $('#' + divId).children('div')[0].getAttribute('dragtableTitleFont'),
                    dragtableSql: $('#' + divId).children('div')[0].getAttribute('dragtableSql'),
                    dragtableTime: $('#' + divId).children('div')[0].getAttribute('dragtableTime'),
                    dragCardColor: $('#' + divId).children('div')[0].getAttribute('dragCardColor'),
                    dragtableTitleBefore: $('#' + divId).children('div')[0].getAttribute('dragtableTitleBefore'),
                    dragtableType: $('#' + divId).children('div')[0].getAttribute('dragtableType'),
                    dragtableLinkName: $('#' + divId).children('div')[0].getAttribute('dragtableLinkName'),
                    dragtableLinkPath: $('#' + divId).children('div')[0].getAttribute('dragtableLinkPath'),
                    dragtableLinkStyle: $('#' + divId).children('div')[0].getAttribute('dragtableLinkStyle'),
                    dragtableTheadStyle: $('#' + divId).children('div')[0].getAttribute('dragtableTheadStyle'),
                    dragtableTbodyStyle: $('#' + divId).children('div')[0].getAttribute('dragtableTbodyStyle'),
                };
                const divAttributes = Object.entries(dragParams)
                    .map(([param, value]) => ` ${param}="${value}"`)
                    .join("");
                html += `dragHttp.postFromAjax(\`${dragParams.dragtableSql}\`,function(data){
                      var json=JSON.parse(data);
                      var jsonCount=json.length;
                      var keys=Object.keys(json[0]);
                      var values=Object.values(json);
                      var html=\`<li><div id="`+ divId + `" class="dragtable handle-resize" >\`;
                      html+=\`<div ${divAttributes} style="display:none;" ></div>\`;
                      html += \`<div class="card" style="background-color:${dragParams.dragCardColor};"><div class="card-header" style="${dragParams.dragtableTitleFont}">
                                  <span class="${dragParams.dragtableTitleBefore}">${dragParams.dragtableTitle}</span>
                                  <a href="javascript:void(0);" onclick="dragConst.tabMenu('${dragParams.dragtableLinkPath}', '${dragParams.dragtableTitle}')" style="${dragParams.dragtableLinkStyle}">${dragParams.dragtableLinkName}</a>
                              </div>\`;
                      html+= \`<div class="card-body">\`;
                      html+=\`<div class="tableScroll">\`;
                      if(jsonCount>0){
                          html+=\`<table class="${dragParams.dragtableType}">\`;
                          html+=\`<thead class="theadsticky" style="background-color:${dragParams.dragCardColor};"><tr>\`;
                          for(var x=0;x<keys.length;x++){
                              html+=\`<th style="${dragParams.dragtableTheadStyle}">\`+keys[x]+\`</th>\`;
                          }
                          html+=\`</tr></thead>\`;
                          html+=\`<tbody>\`;
                          for(var x=0;x<values.length;x++){
                              html+="<tr>";
                              for(var y=0;y<keys.length;y++){
                                  html+=\`<td style="${dragParams.dragtableTbodyStyle}">\`+values[x][keys[y]]+\`</td>\`;
                              }
                              html+=\`</tr>\`;
                          }
                          html+=\`</tbody>\`;
                          html+=\`<tbody class="tbody2"></tbody></table>\`;
                      }
                      html+=\`
                      </div>
                      </div>
                      </div></div>
                      </li>\`;
                      gridster.add_widget(html,`+ dragwidth + `,` + dragheight + `, ` + col + `,` + row + `);
                      dragScroll.autoScroll(\`${divId}\`);
                  });
                  `;
            }
            if (tagClass == "draggaugepic") {
                var row = $('#' + divId).parent().attr("data-row");
                var col = $('#' + divId).parent().attr("data-col");
                var dragwidth = $('#' + divId).parent().attr("data-sizex");
                var dragheight = $('#' + divId).parent().attr("data-sizey");
                const dragParams = {
                    dragPicTitle: $('#' + divId).children('div')[0].getAttribute('dragPicTitle'),
                    dragPicSql: $('#' + divId).children('div')[0].getAttribute('dragPicSql'),
                    dragPicTime: $('#' + divId).children('div')[0].getAttribute('dragPicTime'),
                    dragCardColor: $('#' + divId).children('div')[0].getAttribute('dragCardColor'),
                    dragPicTitleBefore: $('#' + divId).children('div')[0].getAttribute('dragPicTitleBefore'),
                    dragPicTitleFont: $('#' + divId).children('div')[0].getAttribute('dragPicTitleFont'),
                    dragPicLinkName: $('#' + divId).children('div')[0].getAttribute('dragPicLinkName'),
                    dragPicLinkPath: $('#' + divId).children('div')[0].getAttribute('dragPicLinkPath'),
                    dragPicLinkStyle: $('#' + divId).children('div')[0].getAttribute('dragPicLinkStyle'),
                    dragPicFontSize: $('#' + divId).children('div')[0].getAttribute('dragPicFontSize'),
                };
                const divAttributes = Object.entries(dragParams)
                    .map(([param, value]) => ` ${param}="${value}"`)
                    .join("");
                html += `dragHttp.postFromAjax(\`${dragParams.dragPicSql}\`,function(data){
                      var json=JSON.parse(data);
                      var jsonCount=json.length;
                      var option="";
                      var keys=Object.keys(json[0]);
                      var values=Object.values(json[0]);
                      var html=\`<li>
                                      <div id="${divId}" class="draggaugepic handle-resize" >
                                      <div ${divAttributes} style="display:none;" ></div>
                                      <div class="card" style="background-color:${dragParams.dragCardColor}">
                                          <div class="card-header" style="${dragParams.dragPicTitleFont}">
                                              <span class="${dragParams.dragPicTitleBefore}">${dragParams.dragPicTitle}</span>
                                              <a href="javascript:void(0);" onclick="dragConst.tabMenu('${dragParams.dragPicLinkPath}', '${dragParams.dragPicTitle}')" style="${dragParams.dragPicLinkStyle}">${dragParams.dragPicLinkName}</a>
                                          </div>
                                      <div class="card-body">\`;
                      if(jsonCount>0){
                          option = {
                              textStyle: {
                                  fontSize: ${dragParams.dragPicFontSize}
                              },
                              tooltip: {
                                formatter: '{a} <br/>{b} : {c}%'
                              },
                              toolbox: {
                                  show: true,
                                  feature: {
                                    mark: { show: true },
                                    dataView: { show: true, readOnly: false },
                                    restore: { show: true },
                                    saveAsImage: { show: true }
                                  }
                                },
                              series: [
                                {
                                  name: "${dragParams.dragPicTitle}",
                                  type: 'gauge',
                                  detail: {
                                    formatter: '{value}'
                                  },
                                  data: [
                                    {
                                      value: values[0],
                                      name: keys[0]
                                    }
                                  ]
                                }
                              ]
                            };               
                      }
                      html+=\`
                      </div>
                      </div></div>
                      </li>\`; 
                      gridster.add_widget(html,`+ dragwidth + `,` + dragheight + `, ` + col + `,` + row + `);
                      var mydiv = $("#${divId}").children("div").children("div")[1];
                      var myChart = echarts.init(mydiv);
                      myChart.setOption(option);
                      mydiv.setAttribute("myChart_id", myChart.id);
                  });      
                      `;
            }
            if (tagClass == "dragpiepic") {
                var row = $('#' + divId).parent().attr("data-row");
                var col = $('#' + divId).parent().attr("data-col");
                var dragwidth = $('#' + divId).parent().attr("data-sizex");
                var dragheight = $('#' + divId).parent().attr("data-sizey");
                const dragParams = {
                    dragPicTitle: $('#' + divId).children('div')[0].getAttribute('dragPicTitle'),
                    dragPicSql: $('#' + divId).children('div')[0].getAttribute('dragPicSql'),
                    dragPicTime: $('#' + divId).children('div')[0].getAttribute('dragPicTime'),
                    dragCardColor: $('#' + divId).children('div')[0].getAttribute('dragCardColor'),
                    dragPicTitleBefore: $('#' + divId).children('div')[0].getAttribute('dragPicTitleBefore'),
                    dragPicTitleFont: $('#' + divId).children('div')[0].getAttribute('dragPicTitleFont'),
                    dragPicLinkName: $('#' + divId).children('div')[0].getAttribute('dragPicLinkName'),
                    dragPicLinkPath: $('#' + divId).children('div')[0].getAttribute('dragPicLinkPath'),
                    dragPicLinkStyle: $('#' + divId).children('div')[0].getAttribute('dragPicLinkStyle'),
                    dragPicFontSize: $('#' + divId).children('div')[0].getAttribute('dragPicFontSize'),
                };
                const divAttributes = Object.entries(dragParams)
                    .map(([param, value]) => ` ${param}="${value}"`)
                    .join("");
                html += `dragHttp.postFromAjax(\`${dragParams.dragPicSql}\`,function(data){
                      var json=JSON.parse(data);
                      var jsonCount=json.length;
                      var option="";
                      var keys=Object.keys(json[0]);
                      var values=Object.values(json);
                      var datas = $.map(keys, (key) => ({
                          value: values[0][key],
                          name: key
                        }));
                      var html=\`<li>
                                      <div id="${divId}" class="dragpiepic handle-resize" >
                                      <div ${divAttributes} style="display:none;" ></div>
                                      <div class="card" style="background-color:${dragParams.dragCardColor}">
                                          <div class="card-header" style="${dragParams.dragPicTitleFont}">
                                              <span class="${dragParams.dragPicTitleBefore}">${dragParams.dragPicTitle}</span>
                                              <a href="javascript:void(0);" onclick="dragConst.tabMenu('${dragParams.dragPicLinkPath}', '${dragParams.dragPicTitle}')" style="${dragParams.dragPicLinkStyle}">${dragParams.dragPicLinkName}</a>
                                          </div>
                                      <div class="card-body">\`;
                        if(jsonCount>0){
                          option = {
                              textStyle: {
                                  fontSize: ${dragParams.dragPicFontSize}
                              },
                                tooltip: {
                                  trigger: 'item'
                                },
                              legend: {
                                top: 'bottom'
                              },
                              toolbox: {
                                show: true,
                                feature: {
                                  mark: { show: true },
                                  dataView: { show: true, readOnly: false },
                                  restore: { show: true },
                                  saveAsImage: { show: true }
                                }
                              },
                              series: [
                                {
                                  name: "${dragParams.dragPicTitle}",
                                  type: 'pie',
                                  center: ['50%', '50%'],
                                  roseType: 'area',
                                  itemStyle: {
                                    borderRadius: 8
                                  },
                                  data: datas
                                }
                              ]
                            };
          
                      }
                      html+=\`
                      </div>
                      </div></div>
                      </li>\`;   
                      gridster.add_widget(html,`+ dragwidth + `,` + dragheight + `, ` + col + `,` + row + `);
                      var mydiv = $("#${divId}").children("div").children("div")[1];
                      var myChart = echarts.init(mydiv);
                      myChart.setOption(option);
                      mydiv.setAttribute("myChart_id", myChart.id);
                  });  
                  `;
            }
            if (tagClass == "dragbarpic") {
                var row = $('#' + divId).parent().attr("data-row");
                var col = $('#' + divId).parent().attr("data-col");
                var dragwidth = $('#' + divId).parent().attr("data-sizex");
                var dragheight = $('#' + divId).parent().attr("data-sizey");
                const dragParams = {
                    dragPicTitle: $('#' + divId).children('div')[0].getAttribute('dragPicTitle'),
                    dragPicSql: $('#' + divId).children('div')[0].getAttribute('dragPicSql'),
                    dragPicTime: $('#' + divId).children('div')[0].getAttribute('dragPicTime'),
                    dragCardColor: $('#' + divId).children('div')[0].getAttribute('dragCardColor'),
                    dragPicTitleBefore: $('#' + divId).children('div')[0].getAttribute('dragPicTitleBefore'),
                    dragPicTitleFont: $('#' + divId).children('div')[0].getAttribute('dragPicTitleFont'),
                    dragPicLinkName: $('#' + divId).children('div')[0].getAttribute('dragPicLinkName'),
                    dragPicLinkPath: $('#' + divId).children('div')[0].getAttribute('dragPicLinkPath'),
                    dragPicLinkStyle: $('#' + divId).children('div')[0].getAttribute('dragPicLinkStyle'),
                    dragPicFontSize: $('#' + divId).children('div')[0].getAttribute('dragPicFontSize'),
                    dragPicTypes: $('#' + divId).children('div')[0].getAttribute('dragPicTypes'),
                };
                const divAttributes = Object.entries(dragParams)
                    .map(([param, value]) => ` ${param}="${value}"`)
                    .join("");
                html += `dragHttp.postFromAjax(\`${dragParams.dragPicSql}\`,function(data){
                      var json=JSON.parse(data);
                      var jsonCount=json.length;
                      var option="";
                      let legendDatas = Object.keys(json[0]);
                      const values = Object.values(json);
                      const keys = $.map(values, (item) => item[legendDatas[0]]);
                      legendDatas.shift();
                      const getTypes = "${dragParams.dragPicTypes}".split(",");
                      const newArr = dragConst.barTypes.map((value, index) => getTypes[index] || value);
                      const datas = legendDatas.map((key, index) => ({
                          name: key,
                          type: newArr[index],
                          data: json.map(item => item[key])
                      }));
                      var html=\`<li>
                                      <div id="${divId}" class="dragbarpic handle-resize" >
                                      <div ${divAttributes} style="display:none;" ></div>
                                      <div class="card" style="background-color:${dragParams.dragCardColor}">
                                          <div class="card-header" style="${dragParams.dragPicTitleFont}">
                                              <span class="${dragParams.dragPicTitleBefore}">${dragParams.dragPicTitle}</span>
                                              <a href="javascript:void(0);" onclick="dragConst.tabMenu('${dragParams.dragPicLinkPath}', '${dragParams.dragPicTitle}')" style="${dragParams.dragPicLinkStyle}">${dragParams.dragPicLinkName}</a>
                                          </div>
                                      <div class="card-body">\`;
                      if(jsonCount>0){
                          option = {
                              textStyle: {
                                  fontSize: ${dragParams.dragPicFontSize}
                              },
                                toolbox: {
                                  show: true,
                                  feature: {
                                    mark: { show: true },
                                    dataView: { show: true, readOnly: false },
                                    restore: { show: true },
                                    saveAsImage: { show: true }
                                  }
                                },
                              tooltip: {
                                  trigger: 'item'
                                },
                              grid: {
                                left: '3%',
                                right: '4%',
                                bottom: '3%',
                                containLabel: true
                              },
                              legend: {
                                  data: legendDatas
                                },
                              xAxis: [
                                {
                                  type: 'category',
                                  data: keys,
                                  axisTick: {
                                    alignWithLabel: true
                                  }
                                }
                              ],
                              yAxis: [
                                {
                                  type: 'value'
                                }
                              ],
                              series: datas
                            };
                      }
                      html+=\`
                      </div>
                      </div></div>
                      </li>\`;
                      gridster.add_widget(html,`+ dragwidth + `,` + dragheight + `, ` + col + `,` + row + `);
                      var mydiv = $("#${divId}").children("div").children("div")[1];
                      var myChart = echarts.init(mydiv);
                      myChart.setOption(option);
                      mydiv.setAttribute("myChart_id", myChart.id);
                  });
                  `;
            }
            if (tagClass == "draglinepic") {
                var row = $('#' + divId).parent().attr("data-row");
                var col = $('#' + divId).parent().attr("data-col");
                var dragwidth = $('#' + divId).parent().attr("data-sizex");
                var dragheight = $('#' + divId).parent().attr("data-sizey");
                const dragParams = {
                    dragPicTitle: $('#' + divId).children('div')[0].getAttribute('dragPicTitle'),
                    dragPicSql: $('#' + divId).children('div')[0].getAttribute('dragPicSql'),
                    dragPicTime: $('#' + divId).children('div')[0].getAttribute('dragPicTime'),
                    dragCardColor: $('#' + divId).children('div')[0].getAttribute('dragCardColor'),
                    dragPicTitleBefore: $('#' + divId).children('div')[0].getAttribute('dragPicTitleBefore'),
                    dragPicTitleFont: $('#' + divId).children('div')[0].getAttribute('dragPicTitleFont'),
                    dragPicLinkName: $('#' + divId).children('div')[0].getAttribute('dragPicLinkName'),
                    dragPicLinkPath: $('#' + divId).children('div')[0].getAttribute('dragPicLinkPath'),
                    dragPicLinkStyle: $('#' + divId).children('div')[0].getAttribute('dragPicLinkStyle'),
                    dragPicFontSize: $('#' + divId).children('div')[0].getAttribute('dragPicFontSize'),
                    dragPicTypes: $('#' + divId).children('div')[0].getAttribute('dragPicTypes'),
                };
                const divAttributes = Object.entries(dragParams)
                    .map(([param, value]) => ` ${param}="${value}"`)
                    .join("");
                html += `dragHttp.postFromAjax(\`${dragParams.dragPicSql}\`,function(data){
                      var json=JSON.parse(data);
                      var jsonCount=json.length;
                      var option="";
                      let legendDatas = Object.keys(json[0]);
                      const values = Object.values(json);
                      const keys = $.map(values, (item) => item[legendDatas[0]]);
                      legendDatas.shift();
                      const datas = legendDatas.map(key => ({
                          name: key,
                          type: "line",
                          data: json.map(item => item[key])
                      }));
                      var html=\`<li>
                                      <div id="${divId}" class="draglinepic handle-resize" >
                                      <div ${divAttributes} style="display:none;" ></div>
                                      <div class="card" style="background-color:${dragParams.dragCardColor}">
                                          <div class="card-header" style="${dragParams.dragPicTitleFont}">
                                              <span class="${dragParams.dragPicTitleBefore}">${dragParams.dragPicTitle}</span>
                                              <a href="javascript:void(0);" onclick="dragConst.tabMenu('${dragParams.dragPicLinkPath}', '${dragParams.dragPicTitle}')" style="${dragParams.dragPicLinkStyle}">${dragParams.dragPicLinkName}</a>
                                          </div>
                                      <div class="card-body">\`;
                      if(jsonCount>0){
                          option = {
                              textStyle: {
                                  fontSize: ${dragParams.dragPicFontSize}
                              },
                              toolbox: {
                                  show: true,
                                  feature: {
                                    mark: { show: true },
                                    dataView: { show: true, readOnly: false },
                                    restore: { show: true },
                                    saveAsImage: { show: true }
                                  }
                                },
                              tooltip: {
                                trigger: "axis",
                              },
                              legend: {
                                data: legendDatas,
                              },
                              xAxis: {
                                type: "category",
                                boundaryGap: false,
                                data: keys,
                              },
                              yAxis: {
                                type: "value",
                              },
                              series: datas,
                            };
                      }
                      html+=\`
                      </div>
                      </div></div>
                      </li>\`;
                      gridster.add_widget(html,`+ dragwidth + `,` + dragheight + `, ` + col + `,` + row + `);
                      var mydiv = $("#${divId}").children("div").children("div")[1];
                      var myChart = echarts.init(mydiv);
                      myChart.setOption(option);
                      mydiv.setAttribute("myChart_id", myChart.id);
                  });
                  `;
            }
            if (tagClass == "draghidediv") {
                var row = $('#' + divId).parent().attr("data-row");
                var col = $('#' + divId).parent().attr("data-col");
                var dragwidth = $('#' + divId).parent().attr("data-sizex");
                var dragheight = $('#' + divId).parent().attr("data-sizey");

                html += `{
                      var html = \`<li><div id="${divId}" class="draghidediv handle-resize" >
                          <div class="card"></div>
                      </div>
                  </li>\`;
              gridster.add_widget(html,`+ dragwidth + `,` + dragheight + `, ` + col + `,` + row + `);
                  }
                  `;
            }
        });
        // 结尾
        html += `
          });
          </script>
      `;
        Loading(true, "正在提交数据...");
        window.setTimeout(function () {
            var postData = {
                Title: title,
                RefreshTime: 0,
                Description: "",
                ModelCode: html,
                ViewLink: showHtml,
                Id: id,
            }
            AjaxJson("/KanBanModule/KBInfo/SubmitForm?KeyValue=" + id, postData, function (data) {
                tipDialog(data.Message, 3, data.Code);
                if ($("#inputDragId").val() == "") {
                    $("#inputDragId").val(data.KeyId);
                }
            });
        }, 200);

    },
    reData: function () {
        location.reload();
    }
}

var dragSelector = {
    bgSelectShow: function (el) {
        $(el).parent().children("div").toggle();
    },
    beforeSelectShow: function (el) {
        $(el).parent().children("div").toggle();
    },
    ionimgSelectShow: function (el) {
        $(el).parent().children("iframe").toggle();
    },
    awesomeimgSelectShow: function (el) {
        $(el).parent().children("iframe").toggle();
    },
    createBGDiv: function (container) {
        const colorOptions = [
            { colorClass: "bg-blue-theme", colorCode: "#156edb" },
            { colorClass: "bg-red", colorCode: "#dd4b39" },
            { colorClass: "bg-gray", colorCode: "#d2d6de" },
            { colorClass: "bg-gray-light", colorCode: "#f7f7f7" },
            { colorClass: "bg-yellow", colorCode: "#f39c12" },
            { colorClass: "bg-aqua", colorCode: "#00c0ef" },
            { colorClass: "bg-blue", colorCode: "#0073b7" },
            { colorClass: "bg-light-blue", colorCode: "#3c8dbc" },
            { colorClass: "bg-green", colorCode: "#00a65a" },
            { colorClass: "bg-navy", colorCode: "#001F3F" },
            { colorClass: "bg-teal", colorCode: "#39CCCC" },
            { colorClass: "bg-olive", colorCode: "#3D9970" },
            { colorClass: "bg-lime", colorCode: "#01FF70" },
            { colorClass: "bg-orange", colorCode: "#FF851B" },
            { colorClass: "bg-fuchsia", colorCode: "#F012BE" },
            { colorClass: "bg-purple", colorCode: "#605ca8" },
            { colorClass: "bg-maroon", colorCode: "#D81B60" },
            { colorClass: "bg-blue-active", colorCode: "#005384" },
            { colorClass: "bg-light-blue-active", colorCode: "#357ca5" },
            { colorClass: "bg-green-active", colorCode: "#008d4c" },
            { colorClass: "bg-white", colorCode: "#fff" }
        ];

        colorOptions.forEach(option => {
            const div = document.createElement("div");
            div.classList.add("color-option-bg");
            div.setAttribute("data-color", option.colorClass);
            div.style.backgroundColor = option.colorCode;
            container.appendChild(div);
        });
    },
    createTitleBeforeDiv: function (container) {
        const colorOptions = [
            { colorClass: "card-header-before-blue-theme", colorCode: "#156edb" },
            { colorClass: "card-header-before-red", colorCode: "#dd4b39" },
            { colorClass: "card-header-before-gray", colorCode: "#d2d6de" },
            { colorClass: "card-header-before-gray-light", colorCode: "#f7f7f7" },
            { colorClass: "card-header-before-yellow", colorCode: "#f39c12" },
            { colorClass: "card-header-before-aqua", colorCode: "#00c0ef" },
            { colorClass: "card-header-before-blue", colorCode: "#3796EC" },
            { colorClass: "card-header-before-light-blue", colorCode: "#3c8dbc" },
            { colorClass: "card-header-before-green", colorCode: "#00a65a" },
            { colorClass: "card-header-before-navy", colorCode: "#001F3F" },
            { colorClass: "card-header-before-teal", colorCode: "#39CCCC" },
            { colorClass: "card-header-before-olive", colorCode: "#3D9970" },
            { colorClass: "card-header-before-lime", colorCode: "#01FF70" },
            { colorClass: "card-header-before-orange", colorCode: "#FF851B" },
            { colorClass: "card-header-before-fuchsia", colorCode: "#F012BE" },
            { colorClass: "card-header-before-purple", colorCode: "#605ca8" },
            { colorClass: "card-header-before-maroon", colorCode: "#D81B60" },
            { colorClass: "card-header-before-blue-active", colorCode: "#005384" },
            { colorClass: "card-header-before-light-blue-active", colorCode: "#357ca5" },
            { colorClass: "card-header-before-green-active", colorCode: "#008d4c" },
            { colorClass: "card-header-before-white", colorCode: "#fff" }
        ];
        colorOptions.forEach(option => {
            const div = document.createElement("div");
            div.classList.add("before-option-color");
            div.setAttribute("data-color", option.colorClass);
            div.style.backgroundColor = option.colorCode;
            container.appendChild(div);
        });
    }
}


$(function () {
    //标题
    $("body").on("mouseenter", ".handle-title", function () {
        hoveTag = $(
            `<div class="hoveTag">
    <i class="fa fa-edit" aria-hidden="true" onclick="dragDivChange.editDiv('` +
            this.id +
            `')"/></i>
    </div>`
        );
        $(this).prepend(hoveTag);
    });
    $("body").on("mouseleave", ".handle-title", function () {
        $(this).find(".hoveTag").remove();
    });

    $("#myModal").on("hidden.bs.modal", function () {
    });

    $("body").on("mouseenter", ".handle-resize", function () {
        var tagClass = $('#' + this.id).attr('class').split(" ")[0];
        var tagStyle = "";
        var editStyle = "";
        if (tagClass == "dragtable") {
            tagStyle = "position: absolute;right:0px;";
        }
        if (tagClass == "draghidediv") {
            editStyle = "display:none;";
        }
        hoveTag = $(
            `<div class="hoveTag" style="${tagStyle}">
      <i class="fa fa-copy" aria-hidden="true" onclick="dragDivChange.copyDiv('${this.id}')" /></i>
      <i class="fa fa-edit" aria-hidden="true" onclick="dragDivChange.editDiv('${this.id}')" style="${editStyle}"/></i>
      <i class="fa fa-trash" aria-hidden="true" onclick="dragDivChange.delDiv('${this.id}')" /></i>
      </div>`
        );
        $(this).css("background-color", "ghostwhite");
        $(this).prepend(hoveTag);
    });
    $("body").on("mouseleave", ".handle-resize", function () {
        $(this).css("background-color", "initial");
        $(this).find(".hoveTag").remove();
    });

    gridster = $(".gridster ul")
        .gridster({
            autogenerate_stylesheet: true,
            avoid_overlapped_widgets: true, //设置为true，不允许模块叠加
            shift_widgets_up: false, //设置为true，模块向上移动时，其他模块向下移动
            shift_larger_widgets_down: false, //设置为true，模块向下移动时，其他模块向上移动
            collision: { wait_for_mouseup: true },
            widget_base_dimensions: [60, 30], //[240,160]
            widget_margins: [20, 20], //模块的间距 [上下,左右]
            widget_max_size: { x: 20, y: 40 },
            extra_rows: 300,
            max_rows: 315,
            helper: "clone",
            resize: {
                enabled: true, //默认false，设置为true时表示可以拖动模块的右下角改变模块大小
                stop: function (e, ui, $widget) {
                    if ($widget[0].children[0].id != undefined && $widget[0].children[0].id != '' && $widget[0].children[0].id.indexOf("pic") >= 0) {
                        let myChart_id;
                        if ($widget[0].children[0].children[1].getAttribute("class") != "card") {
                            myChart_id = $widget[0].children[0].children[2].children[1].getAttribute("myChart_id");
                        } else {
                            myChart_id =
                                $widget[0].children[0].children[1].children[1].getAttribute("myChart_id");
                        }
                        var myChart = echarts.getInstanceById(myChart_id);
                        myChart.resize();
                    }
                }, //鼠标停止调动大小时执行的函数
            },
        })
        .data("gridster");

    $(".colorSelect").bigColorpicker(function (el, color) {
        $(el).css("background", color);
        $(el).parent().children("input").val(color);
    });


    // 监听 iframe 中的内容点击事件
    $('.ion-iframe').on('load', function () {
        //const iframeContentDocument = this.contentDocument;
        const dataAttribute = this.dataset.attribute;
        $(this).contents().find('div').on('click', function () {
            if ($(this).children("span").attr('class') != undefined) {
                const selectedContent = $(this).children("span").attr('class');
                var strs = dataAttribute.split(",");
                $('#' + strs[0]).val(selectedContent);
                $("#" + strs[1]).hide();
            }
        });
    });
    $('.awesome-iframe').on('load', function () {
        //const iframeContentDocument = this.contentDocument;
        const dataAttribute = this.dataset.attribute;
        $(this).contents().find('div').on('click', function () {
            if ($(this).children("div").children("i").attr('class') != undefined) {
                const selectedContent = $(this).children("div").children("i").attr('class');
                var strs = dataAttribute.split(",");
                $('#' + strs[0]).val(selectedContent);
                $("#" + strs[1]).hide();
            }
        });
    });

});

document.addEventListener("DOMContentLoaded", function () {//元素加载完成事件
    // 背景颜色选项卡
    const containers = document.querySelectorAll(".color-options-bg");
    containers.forEach(container => {
        dragSelector.createBGDiv(container);
    });
    // 当颜色选项被点击时，将所选颜色设置到输入框中，并隐藏颜色选项
    $('.color-option-bg').on('click', function () {
        const selectedColor = $(this).data('color');
        $(this).parent().parent().children("input").val(selectedColor);
        $(this).parent().parent().children("div").hide();
    });
    // 标题前缀色
    const containersBefore = document.querySelectorAll(".before-options-color");
    containersBefore.forEach(container => {
        dragSelector.createTitleBeforeDiv(container);
    });
    // 当颜色选项被点击时，将所选颜色设置到输入框中，并隐藏颜色选项
    $('.before-option-color').on('click', function () {
        const selectedColor = $(this).data('color');
        $(this).parent().parent().children("input").val(selectedColor);
        $(this).parent().parent().children("div").hide();
    });
    $('#dragonelabelSet').on('shown.bs.modal', function () {
        if (!inputDragonelabelSqlInstance) {
            inputDragonelabelSqlInstance = CodeMirror.fromTextArea(document.getElementById("inputDragonelabelSql"), {
                mode: "text/x-sparksql", // spark sql模式
                lineNumbers: true,  //显示行号
                theme: "idea",   //设置主题
            });
        }
    });
    $('#dragonelabelSet').on('hidden.bs.modal', function () {
        if (inputDragonelabelSqlInstance) {
            inputDragonelabelSqlInstance.toTextArea();
            inputDragonelabelSqlInstance = null;
        }
    });
    $('#dragcardlabelSet').on('shown.bs.modal', function () {
        if (!inputDragcardlabelSqlInstance) {
            inputDragcardlabelSqlInstance = CodeMirror.fromTextArea(document.getElementById("inputDragcardlabelSql"), {
                mode: "text/x-sparksql", // spark sql模式
                lineNumbers: true,  //显示行号
                theme: "idea",   //设置主题
            });
        }
    });
    $('#dragcardlabelSet').on('hidden.bs.modal', function () {
        if (inputDragcardlabelSqlInstance) {
            inputDragcardlabelSqlInstance.toTextArea();
            inputDragcardlabelSqlInstance = null;
        }
    });
    $('#dragtableSet').on('shown.bs.modal', function () {
        if (!inputDragtableSqlInstance) {
            inputDragtableSqlInstance = CodeMirror.fromTextArea(document.getElementById("inputDragtableSql"), {
                mode: "text/x-sparksql", // spark sql模式
                lineNumbers: true,  //显示行号
                theme: "idea",   //设置主题
            });
        }
    });
    $('#dragtableSet').on('hidden.bs.modal', function () {
        if (inputDragtableSqlInstance) {
            inputDragtableSqlInstance.toTextArea();
            inputDragtableSqlInstance = null;
        }
    });
    $('#draggaugeSet').on('shown.bs.modal', function () {
        if (!inputDraggaugeSqlInstance) {
            inputDraggaugeSqlInstance = CodeMirror.fromTextArea(document.getElementById("inputDraggaugeSql"), {
                mode: "text/x-sparksql", // spark sql模式
                lineNumbers: true,  //显示行号
                theme: "idea",   //设置主题
            });
        }
    });
    $('#draggaugeSet').on('hidden.bs.modal', function () {
        if (inputDraggaugeSqlInstance) {
            inputDraggaugeSqlInstance.toTextArea();
            inputDraggaugeSqlInstance = null;
        }
    });
    $('#dragpieSet').on('shown.bs.modal', function () {
        if (!inputDragpieSqlInstance) {
            inputDragpieSqlInstance = CodeMirror.fromTextArea(document.getElementById("inputDragpieSql"), {
                mode: "text/x-sparksql", // spark sql模式
                lineNumbers: true,  //显示行号
                theme: "idea",   //设置主题
            });
        }
    });
    $('#dragpieSet').on('hidden.bs.modal', function () {
        if (inputDragpieSqlInstance) {
            inputDragpieSqlInstance.toTextArea();
            inputDragpieSqlInstance = null;
        }
    });
    $('#dragbarSet').on('shown.bs.modal', function () {
        if (!inputDragbarSqlInstance) {
            inputDragbarSqlInstance = CodeMirror.fromTextArea(document.getElementById("inputDragbarSql"), {
                mode: "text/x-sparksql", // spark sql模式
                lineNumbers: true,  //显示行号
                theme: "idea",   //设置主题
            });
        }
    });
    $('#dragbarSet').on('hidden.bs.modal', function () {
        if (inputDragbarSqlInstance) {
            inputDragbarSqlInstance.toTextArea();
            inputDragbarSqlInstance = null;
        }
    });
    $('#draglineSet').on('shown.bs.modal', function () {
        if (!inputDraglineSqlInstance) {
            inputDraglineSqlInstance = CodeMirror.fromTextArea(document.getElementById("inputDraglineSql"), {
                mode: "text/x-sparksql", // spark sql模式
                lineNumbers: true,  //显示行号
                theme: "idea",   //设置主题
            });
        }
    });
    $('#draglineSet').on('hidden.bs.modal', function () {
        if (inputDraglineSqlInstance) {
            inputDraglineSqlInstance.toTextArea();
            inputDraglineSqlInstance = null;
        }
    });

    const liItems = document.querySelectorAll('.sys_spec_text li');

    liItems.forEach(li => {
        li.addEventListener('click', function () {
            // 清除所有选项的active类
            liItems.forEach(item => item.classList.remove('active'));
            // 将当前点击的li元素添加active类
            this.classList.add('active');
            // 在此处添加处理点击事件的逻辑
            const selectedOption = $(this).attr("value");
            let soureData = $(this).parent().parent().parent().children("input").val();
            if (soureData == '') {
                soureData = selectedOption;
            } else {
                soureData = soureData + "," + selectedOption;
            }
            $(this).parent().parent().parent().children("input").val(soureData);
        });
    });

});
