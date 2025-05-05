using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace DTO.KanBan
{
    [Serializable]
    public class KBInfo
    {
        public KBInfo()
        {
        }

        private long id;
        /// <summary>
        ///  
        /// </summary>
        [Column("id")]
        public long Id
        {
            get { return id; }
            set { id = value; }
        }

        private int? type;
        /// <summary>
        /// 类型
        /// </summary>
        [Column("type")]
        public int? Type
        {
            get { return type; }
            set { type = value; }
        }

        private int? refreshtime;
        /// <summary>
        /// 刷新时间
        /// </summary>
        [Column("refreshtime")]
        public int? Refreshtime
        {
            get { return refreshtime; }
            set { refreshtime = value; }
        }

        private string title;
        /// <summary>
        /// 标题
        /// </summary>
        [Column("title")]
        public string Title
        {
            get { return title; }
            set { title = value; }
        }

        private string description;
        /// <summary>
        /// 描述
        /// </summary>
        [Column("description")]
        public string Description
        {
            get { return description; }
            set { description = value; }
        }

        private string modelcode;
        /// <summary>
        /// 代码
        /// </summary>
        [Column("modelcode")]
        public string Modelcode
        {
            get { return modelcode; }
            set { modelcode = value; }
        }

        private string viewlink;
        /// <summary>
        /// 预览链接
        /// </summary>
        [Column("viewlink")]
        public string Viewlink
        {
            get { return viewlink; }
            set { viewlink = value; }
        }

        private string createuser;
        /// <summary>
        /// 创建人
        /// </summary>
        [Column("createuser")]
        public string Createuser
        {
            get { return createuser; }
            set { createuser = value; }
        }

        private long createuserid;
        /// <summary>
        /// 创建人id
        /// </summary>
        [Column("createuserid")]
        public long Createuserid
        {
            get { return createuserid; }
            set { createuserid = value; }
        }

        private DateTime? createdate;
        /// <summary>
        /// 创建时间
        /// </summary>
        [Column("createdate")]
        public DateTime? Createdate
        {
            get { return createdate; }
            set { createdate = value; }
        }

        private string edituser;
        /// <summary>
        /// 修改人
        /// </summary>
        [Column("edituser")]
        public string Edituser
        {
            get { return edituser; }
            set { edituser = value; }
        }

        private long edituserid;
        /// <summary>
        /// 修改人id
        /// </summary>
        [Column("edituserid")]
        public long Edituserid
        {
            get { return edituserid; }
            set { edituserid = value; }
        }

        private DateTime? editdate;
        /// <summary>
        /// 修改时间
        /// </summary>
        [Column("editdate")]
        public DateTime? Editdate
        {
            get { return editdate; }
            set { editdate = value; }
        }
    }
}