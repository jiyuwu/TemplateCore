using DTO;
using OfficeOpenXml;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;

namespace Common
{
    public class OfficeHelper
    {
        #region Excel

        #region EPPlus导出Excel
        /// <summary>
        /// datatable导出Excel
        /// </summary>
        /// <param name="dt">数据源</param>
        /// <param name="sWebRootFolder">webRoot文件夹</param>
        /// <param name="sFileName">文件名</param>
        /// <param name="sColumnName">自定义列名（不传默认dt列名）</param>
        /// <param name="msg">失败返回错误信息，有数据返回路径</param>
        /// <returns></returns>
        public static bool DTExportEPPlusExcel(DataTable dt, string sWebRootFolder, string sFileName, string[] sColumnName, ref string msg)
        {
            try
            {
                if (dt == null || dt.Rows.Count == 0)
                {
                    msg = "数据为空";
                    return false;
                }

                //转utf-8
                UTF8Encoding utf8 = new UTF8Encoding();
                byte[] buffer = utf8.GetBytes(sFileName);
                sFileName = utf8.GetString(buffer);

                //判断文件夹，不存在创建
                if (!Directory.Exists(sWebRootFolder))
                    Directory.CreateDirectory(sWebRootFolder);

                //删除大于30天的文件，为了保证文件夹不会有过多文件
                string[] files = Directory.GetFiles(sWebRootFolder, "*.xlsx", SearchOption.AllDirectories);
                foreach (string item in files)
                {
                    FileInfo f = new FileInfo(item);
                    DateTime now = DateTime.Now;
                    TimeSpan t = now - f.CreationTime;
                    int day = t.Days;
                    if (day > 30)
                    {
                        File.Delete(item);
                    }
                }

                //判断同名文件
                FileInfo file = new FileInfo(Path.Combine(sWebRootFolder, sFileName));
                if (file.Exists)
                {
                    //判断同名文件创建时间
                    file.Delete();
                    file = new FileInfo(Path.Combine(sWebRootFolder, sFileName));
                }
                using (ExcelPackage package = new ExcelPackage(file))
                {
                    //添加worksheet
                    ExcelWorksheet worksheet = package.Workbook.Worksheets.Add(sFileName.Split('.')[0]);

                    //添加表头
                    int column = 1;
                    if (sColumnName.Count() == dt.Columns.Count)
                    {
                        foreach (string cn in sColumnName)
                        {
                            worksheet.Cells[1, column].Value = cn.Trim();//可以只保留这个，不加央视，导出速度也会加快

                            worksheet.Cells[1, column].Style.Font.Bold = true;//字体为粗体
                            worksheet.Cells[1, column].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;//水平居中
                            worksheet.Cells[1, column].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;//设置样式类型
                            worksheet.Cells[1, column].Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.FromArgb(159, 197, 232));//设置单元格背景色
                            column++;
                        }
                    }
                    else
                    {
                        foreach (DataColumn dc in dt.Columns)
                        {
                            worksheet.Cells[1, column].Value = dc.ColumnName;//可以只保留这个，不加央视，导出速度也会加快

                            worksheet.Cells[1, column].Style.Font.Bold = true;//字体为粗体
                            worksheet.Cells[1, column].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;//水平居中
                            worksheet.Cells[1, column].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;//设置样式类型
                            worksheet.Cells[1, column].Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.FromArgb(159, 197, 232));//设置单元格背景色
                            column++;
                        }
                    }

                    //添加数据
                    int row = 2;
                    foreach (DataRow dr in dt.Rows)
                    {
                        int col = 1;
                        foreach (DataColumn dc in dt.Columns)
                        {
                            worksheet.Cells[row, col].Value = dr[col - 1].ToString();//这里已知可以减少一层循环，速度会上升
                            col++;
                        }
                        row++;
                    }

                    //自动列宽，由于自动列宽大数据导出严重影响速度，我这里就不开启了，大家可以根据自己情况开启
                    //worksheet.Cells.AutoFitColumns();

                    //保存workbook.
                    package.Save();
                }
                return true;
            }
            catch (Exception ex)
            {
                msg = "生成Excel失败：" + ex.Message;
                CommonHelper.WriteErrorLog("生成Excel失败：" + ex.Message);
                return false;
            }

        }
        /// <summary>
        /// Model导出Excel
        /// </summary>
        /// <param name="list">数据源</param>
        /// <param name="sWebRootFolder">webRoot文件夹</param>
        /// <param name="sFileName">文件名</param>
        /// <param name="sColumnName">自定义列名</param>
        /// <param name="msg">失败返回错误信息，有数据返回路径</param>
        /// <returns></returns>
        public static bool ModelExportEPPlusExcel<T>(List<T> myList, string sWebRootFolder, string sFileName, string[] sColumnName, ref string msg)
        {
            try
            {
                if (myList == null || myList.Count == 0)
                {
                    msg = "数据为空";
                    return false;
                }

                //转utf-8
                UTF8Encoding utf8 = new UTF8Encoding();
                byte[] buffer = utf8.GetBytes(sFileName);
                sFileName = utf8.GetString(buffer);

                //判断文件夹，不存在创建
                if (!Directory.Exists(sWebRootFolder))
                    Directory.CreateDirectory(sWebRootFolder);

                //删除大于30天的文件，为了保证文件夹不会有过多文件
                string[] files = Directory.GetFiles(sWebRootFolder, "*.xlsx", SearchOption.AllDirectories);
                foreach (string item in files)
                {
                    FileInfo f = new FileInfo(item);
                    DateTime now = DateTime.Now;
                    TimeSpan t = now - f.CreationTime;
                    int day = t.Days;
                    if (day > 30)
                    {
                        File.Delete(item);
                    }
                }

                //判断同名文件
                FileInfo file = new FileInfo(Path.Combine(sWebRootFolder, sFileName));
                if (file.Exists)
                {
                    //判断同名文件创建时间
                    file.Delete();
                    file = new FileInfo(Path.Combine(sWebRootFolder, sFileName));
                }
                using (ExcelPackage package = new ExcelPackage(file))
                {
                    //添加worksheet
                    ExcelWorksheet worksheet = package.Workbook.Worksheets.Add(sFileName.Split('.')[0]);

                    //添加表头
                    int column = 1;
                    if (sColumnName.Count() > 0)
                    {
                        foreach (string cn in sColumnName)
                        {
                            worksheet.Cells[1, column].Value = cn.Trim();//可以只保留这个，不加央视，导出速度也会加快

                            worksheet.Cells[1, column].Style.Font.Bold = true;//字体为粗体
                            worksheet.Cells[1, column].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;//水平居中
                            worksheet.Cells[1, column].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;//设置样式类型
                            worksheet.Cells[1, column].Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.FromArgb(159, 197, 232));//设置单元格背景色
                            column++;
                        }
                    }

                    //添加数据
                    int row = 2;
                    foreach (T ob in myList)
                    {
                        int col = 1;
                        foreach (System.Reflection.PropertyInfo property in ob.GetType().GetRuntimeProperties())
                        {
                            worksheet.Cells[row, col].Value = property.GetValue(ob);//这里已知可以减少一层循环，速度会上升
                            col++;
                        }
                        row++;
                    }

                    //自动列宽，由于自动列宽大数据导出严重影响速度，我这里就不开启了，大家可以根据自己情况开启
                    //worksheet.Cells.AutoFitColumns();

                    //保存workbook.
                    package.Save();
                }
                return true;
            }
            catch (Exception ex)
            {
                msg = "生成Excel失败：" + ex.Message;
                CommonHelper.WriteErrorLog("生成Excel失败：" + ex.Message);
                return false;
            }

        }
        #endregion

        #region EPPluse导入

        #region 转换为datatable
        public static DataTable InputEPPlusByExcelToDT(FileInfo file)
        {
            DataTable dt = new DataTable();
            if (file != null)
            {
                using (ExcelPackage package = new ExcelPackage(file))
                {
                    try
                    {
                        ExcelWorksheet worksheet = package.Workbook.Worksheets[1];
                        dt = WorksheetToTable(worksheet);
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine(ex.Message);
                    }
                }
            }
            return dt;
        }
        /// <summary>
        /// 将worksheet转成datatable
        /// </summary>
        /// <param name="worksheet">待处理的worksheet</param>
        /// <returns>返回处理后的datatable</returns>
        public static DataTable WorksheetToTable(ExcelWorksheet worksheet)
        {
            //获取worksheet的行数
            int rows = worksheet.Dimension.End.Row;
            //获取worksheet的列数
            int cols = worksheet.Dimension.End.Column;

            DataTable dt = new DataTable(worksheet.Name);
            DataRow dr = null;
            for (int i = 1; i <= rows; i++)
            {
                if (i > 1)
                    dr = dt.Rows.Add();

                for (int j = 1; j <= cols; j++)
                {
                    //默认将第一行设置为datatable的标题
                    if (i == 1)
                        dt.Columns.Add(GetString(worksheet.Cells[i, j].Value));
                    //剩下的写入datatable
                    else
                        dr[j - 1] = GetString(worksheet.Cells[i, j].Value);
                }
            }
            return dt;
        }
        private static string GetString(object obj)
        {
            try
            {
                return obj.ToString();
            }
            catch (Exception)
            {
                return "";
            }
        }
        #endregion

        #region 转换为IEnumerable<T>
        /// <summary>
        /// 从Excel中加载数据（泛型）
        /// </summary>
        /// <typeparam name="T">每行数据的类型</typeparam>
        /// <param name="FileName">Excel文件名</param>
        /// <returns>泛型列表</returns>
        public static IEnumerable<T> LoadFromExcel<T>(FileInfo existingFile) where T : new()
        {
            //FileInfo existingFile = new FileInfo(FileName);//如果本地地址可以直接使用本方法，这里是直接拿到了文件
            List<T> resultList = new List<T>();
            Dictionary<string, int> dictHeader = new Dictionary<string, int>();

            using (ExcelPackage package = new ExcelPackage(existingFile))
            {
                ExcelWorksheet worksheet = package.Workbook.Worksheets[1];

                int colStart = worksheet.Dimension.Start.Column;  //工作区开始列
                int colEnd = worksheet.Dimension.End.Column;       //工作区结束列
                int rowStart = worksheet.Dimension.Start.Row;       //工作区开始行号
                int rowEnd = worksheet.Dimension.End.Row;       //工作区结束行号

                //将每列标题添加到字典中
                for (int i = colStart; i <= colEnd; i++)
                {
                    dictHeader[worksheet.Cells[rowStart, i].Value.ToString()] = i;
                }

                List<PropertyInfo> propertyInfoList = new List<PropertyInfo>(typeof(T).GetProperties());

                for (int row = rowStart + 1; row <=rowEnd; row++)
                {
                    T result = new T();

                    //为对象T的各属性赋值
                    foreach (PropertyInfo p in propertyInfoList)
                    {
                        try
                        {
                            ExcelRange cell = worksheet.Cells[row, dictHeader[p.Name]]; //与属性名对应的单元格

                            if (cell.Value == null)
                                continue;
                            switch (p.PropertyType.Name.ToLower())
                            {
                                case "string":
                                    p.SetValue(result, cell.GetValue<String>());
                                    break;
                                case "int16":
                                    p.SetValue(result, cell.GetValue<Int16>());
                                    break;
                                case "int32":
                                    p.SetValue(result, cell.GetValue<Int32>());
                                    break;
                                case "int64":
                                    p.SetValue(result, cell.GetValue<Int64>());
                                    break;
                                case "decimal":
                                    p.SetValue(result, cell.GetValue<Decimal>());
                                    break;
                                case "double":
                                    p.SetValue(result, cell.GetValue<Double>());
                                    break;
                                case "datetime":
                                    p.SetValue(result, cell.GetValue<DateTime>());
                                    break;
                                case "boolean":
                                    p.SetValue(result, cell.GetValue<Boolean>());
                                    break;
                                case "byte":
                                    p.SetValue(result, cell.GetValue<Byte>());
                                    break;
                                case "char":
                                    p.SetValue(result, cell.GetValue<Char>());
                                    break;
                                case "single":
                                    p.SetValue(result, cell.GetValue<Single>());
                                    break;
                                default:
                                    break;
                            }
                        }
                        catch (KeyNotFoundException ex)
                        { }
                    }
                    resultList.Add(result);
                }
            }
            return resultList;
        } 
        #endregion
        #endregion

        #endregion
    }
}
