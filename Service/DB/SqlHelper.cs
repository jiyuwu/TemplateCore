using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Common;
using Microsoft.Extensions.Configuration;
using Npgsql;

namespace Service.DB
{
    public static class SqlHelper
    {
        #pragma warning disable CS8601 // 引用类型赋值可能为 null。
        public static readonly string connString = AppSettingsHelper.Configuration.GetConnectionString("PostgresConnection");
        #pragma warning restore CS8601 // 引用类型赋值可能为 null。
        #region 事务
        private static NpgsqlConnection? connTr;
        private static NpgsqlCommand? cmdTr;
        private static NpgsqlTransaction? sqlTr;
        /// <summary>
        /// 事务开始
        /// </summary>
        public static void BeginTransaction()
        {
            connTr = new NpgsqlConnection(connString);
            connTr.Open();
            sqlTr = connTr.BeginTransaction();
        }
        /// <summary>
        /// 事务方法
        /// </summary>
        /// <param name="sql">数据库语句</param>
        /// <param name="ps">参数</param>
        /// <returns></returns>
        public static int ExecuteTranNonQuery(string sql, CommandType commandType, params SqlParameter[] ps)
        {
            cmdTr = new NpgsqlCommand(sql, connTr);
            if (connTr!.State == ConnectionState.Closed)
            {
                connTr.Open();//打开数据库
            }
            cmdTr.CommandType = commandType;
            if (ps != null)
            {
                cmdTr.Parameters.AddRange(ps);
            }
            cmdTr.Transaction = sqlTr;//事物
            return cmdTr.ExecuteNonQuery();
        }
        /// <summary>
        /// 提交事务
        /// </summary>
        public static void Commit()
        {
            sqlTr!.Commit();
        }
        /// <summary>
        /// 事务回滚
        /// </summary>
        public static void Rollback()
        {
            sqlTr!.Rollback();
        }
        /// <summary>
        /// 事务关闭连接
        /// </summary>
        public static void DisTranConnect()
        {
            sqlTr!.Dispose();
            cmdTr!.Dispose();
            connTr!.Close();
            connTr!.Dispose();
        }
        #endregion
        #region 执行 增 删 改
        /// <summary>
        /// 执行 增 删 改
        /// </summary>
        /// <param name="Sql">要执行的Sql</param>
        /// <param name="param">参数</param>
        /// <returns>影响行数</returns>
        public static int ExecuteNonQuery(string sql, CommandType commandType, params NpgsqlParameter[] param)
        {
            //实例化连接对象，并指定连接字符串，自动释放资源，不用关闭
            using (NpgsqlConnection conn = new NpgsqlConnection(connString))
            {
                //实例化命令对象，指定Sql，与连接对象
                using (NpgsqlCommand cmd = new NpgsqlCommand(sql, conn))
                {
                    cmd.CommandType = commandType;
                    //如果有参数
                    if (param != null)
                    {
                        //批量添加参数
                        cmd.Parameters.AddRange(param);
                    }
                    //打开连接
                    conn.Open();
                    //执行Sql并返回影响行数
                    return cmd.ExecuteNonQuery();
                }
            }
        }
        #endregion
        #region 执行 查询
        /// <summary>
        /// 执行 查询
        /// </summary>
        /// <param name="Sql">要执行的Sql</param>
        /// <param name="param">参数</param>
        /// <returns>数据集</returns>
        public static NpgsqlDataReader ExecuteReader(string Sql, CommandType commandType, params NpgsqlParameter[] param)
        {
            //实例化连接对象，并指定连接字符串
            NpgsqlConnection conn = new NpgsqlConnection(connString);
            //实例化命令对象，指定Sql，与连接对象
            using (NpgsqlCommand cmd = new NpgsqlCommand(Sql, conn))
            {
                cmd.CommandType = commandType;
                //如果有参数
                if (param != null)
                {
                    //批量添加参数
                    cmd.Parameters.AddRange(param);
                }
                //打开连接
                conn.Open();
                //执行Sql并返回影响行数,如果将返回的SqlDataReader关闭时也将关闭连接
                return cmd.ExecuteReader(CommandBehavior.CloseConnection);
            }
        }
        /// <summary>
        /// 执行查询存储过程，并且返回一个SqlDataReader对象(使用SqlDataReader对象执行)
        /// </summary>
        /// <param name="sql">存储过程名</param>
        /// <param name="ps">存储过程中需要的参数</param>
        /// <returns>读取器对象</returns>
        public static NpgsqlDataReader ExecuteReaderProc(string Sql, CommandType commandType, params NpgsqlParameter[] param)
        {
            //实例化连接对象，并指定连接字符串
            NpgsqlConnection conn = new NpgsqlConnection(connString);
            //实例化命令对象，指定Sql，与连接对象
            using (NpgsqlCommand cmd = new NpgsqlCommand(Sql, conn))
            {
                cmd.CommandType = commandType;
                //如果有参数
                if (param != null)
                {
                    //批量添加参数
                    cmd.Parameters.AddRange(param);
                }
                //打开连接
                conn.Open();
                cmd.CommandType = CommandType.StoredProcedure;
                //执行Sql并返回影响行数,如果将返回的SqlDataReader关闭时也将关闭连接
                return cmd.ExecuteReader(CommandBehavior.CloseConnection);
            }
        }
        #endregion
        #region 完成数据的查询，返回DataTable
        /// <summary>
        /// 完成数据的查询，返回DataTable
        /// </summary>
        /// <param name="Sql">要执行的Sql</param>
        /// <param name="param">参数</param>
        /// <returns>DataTable</returns>
        public static DataTable GetTable(string sql, CommandType commandType, params NpgsqlParameter[] param)
        {
            DataTable dt = new DataTable();
            //实例化连接对象，并指定连接字符串，自动释放资源，不用关闭
            using (NpgsqlConnection conn = new NpgsqlConnection(connString))
            using (NpgsqlDataAdapter adp = new NpgsqlDataAdapter(sql, conn))
            {
                adp.SelectCommand!.CommandType = commandType;
                if (param != null)
                {
                    adp.SelectCommand.Parameters.AddRange(param);
                }
                adp.Fill(dt);
            }
            return dt;
        }
        #endregion
        #region 返回首行首列
        /// <summary>
        /// 返回首行首列
        /// </summary>
        /// <param name="SqlSql">要执行的SqlSql</param>
        /// <param name="param">参数</param>
        /// <returns></returns>
        public static object ExecuteScaler(string Sql, CommandType commandType, params NpgsqlParameter[] param)
        {
            //实例化连接对象，并指定连接字符串
            using (NpgsqlConnection conn = new NpgsqlConnection(connString))
            //实例化命令对象，指定Sql，与连接对象
            using (NpgsqlCommand cmd = new NpgsqlCommand(Sql, conn))
            {
                cmd.CommandType = commandType;
                //如果有参数
                if (param != null)
                {
                    //批量添加参数
                    cmd.Parameters.AddRange(param);
                }
                //打开连接
                conn.Open();
                //执行Sql
                return cmd.ExecuteScalar();
            }
        }
        #endregion
        #region 批量插入
        public static bool BulkInsert(DataTable dataTable, string tableName)
        {
            bool success = true;
            try
            {
                using (NpgsqlConnection connection = new NpgsqlConnection(connString))
                {
                    connection.Open();
                    using (var writer = connection.BeginBinaryImport($"COPY {tableName} FROM STDIN (FORMAT BINARY)"))
                    {
                        foreach (DataRow row in dataTable.Rows)
                        {
                            object[] values = row.ItemArray;
                            writer.WriteRow(values);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                success = false;
                // Handle the exception, log it, etc.
            }
            return success;
        }
        #endregion
    }
}
