using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Web;

namespace Common
{
    public class TextHelper
    {

        //读写锁，当资源处于写入模式时，其他线程写入需要等待本次写入结束之后才能继续写入
        static ReaderWriterLockSlim LogLock = new ReaderWriterLockSlim();

        #region read
        /// <summary>
        ///  读取返回字符串 path:txt路径
        /// </summary>
        /// <param name="path"></param>
        /// <returns>文本内容字符串</returns>
        public static string ReadToString(string path)
        {
            try
            {
                LogLock.EnterReadLock();
                StringBuilder sb = new StringBuilder();
                using (FileStream fs = new FileStream(path, FileMode.Open))
                {
                    using (StreamReader sr = new StreamReader(fs))
                    {

                        while (sr.Peek() >= 0)
                        {
                            sb.AppendLine(sr.ReadLine());
                        }
                    }
                }
                return sb.ToString();
            }
            catch (IOException e)
            {
                Console.WriteLine(e.ToString());
                return null;
            }
            finally
            {
                LogLock.ExitReadLock();
            }
        }
        #endregion


        #region write
        /// <summary>
        /// 覆盖 path:txt路径 context:文字
        /// </summary>
        /// <param name="path">输出路径</param>
        /// <param name="context">内容</param>
        public static bool CreateWrite(string path, string context)
        {
            bool b = false;
            try
            {
                LogLock.EnterWriteLock();
                FileStream fs = new FileStream(path, FileMode.Create);
                //获得字节数组
                byte[] data = System.Text.Encoding.UTF8.GetBytes(context);
                //开始写入
                fs.Write(data, 0, data.Length);
                //清空缓冲区、关闭流
                fs.Flush();
                fs.Dispose();
                return b;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return b;
            }
            finally
            {
                LogLock.ExitWriteLock();
            }
        }
        /// <summary>
        /// 追加 path:txt路径 context:文字
        /// </summary>
        /// <param name="path">输出路径</param>
        /// <param name="context">内容</param>
        public static bool WriteAppend(string path, string context)
        {
            bool b = false;
            try
            {
                LogLock.EnterWriteLock();
                FileStream fs = new FileStream(path, FileMode.Append);
                StreamWriter sw = new StreamWriter(fs);
                //开始写入
                sw.Write(context);
                //清空缓冲区
                sw.Flush();
                //关闭流
                sw.Dispose();
                fs.Dispose();
                return b;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return b;
            }
            finally
            {
                LogLock.ExitWriteLock();
            }
        }

        /// <summary>
        /// 自动判断追加或创建 path:txt路径 context:文字
        /// </summary>
        /// <param name="path">输出路径</param>
        /// <param name="context">文字</param>
        public static bool CreateOrWriteAppendLine(string path, string context)
        {
            bool b = false;
            try
            {
                LogLock.EnterWriteLock();
                if (!File.Exists(path))
                {
                    FileStream fs = new FileStream(path, FileMode.Create, FileAccess.Write);
                    StreamWriter sw = new StreamWriter(fs);
                    long fl = fs.Length;
                    fs.Seek(fl, SeekOrigin.End);
                    sw.WriteLine(context);
                    sw.Flush();
                    sw.Dispose();
                    fs.Dispose();
                    b = true;
                }
                else
                {
                    FileStream fs = new FileStream(path, FileMode.Open, FileAccess.Write);
                    StreamWriter sw = new StreamWriter(fs);
                    long fl = fs.Length;
                    fs.Seek(fl, SeekOrigin.Begin);
                    sw.WriteLine(context);
                    sw.Flush();
                    sw.Dispose();
                    fs.Dispose();
                    b = true;
                }
                return b;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return b;
            }
            finally
            {
                LogLock.ExitWriteLock();
            }
        }
        #endregion

        #region log
        /// <summary>
        /// 默认输出地址
        /// </summary>
        public static string logPath = @"C:"; //System.IO.Path.GetDirectoryName(System.IO.Directory.GetCurrentDirectory());//获取最初指定程序的位置
        /// <summary>
        /// 日志输出 content：日志内容，filePath：文件输出位置默认C盘MyLog，fileSize：单个文件大小默认1M,fileCount：文件日志数量默认20个
        /// </summary>
        /// <param name="content">日志内容</param>
        /// <param name="filePath">文件输出位置默认C盘MyLog</param>
        /// <param name="fileSize">单个文件大小默认1M</param>
        /// <param name="fileCount">文件日志数量默认20个</param>
        public static void WriteLog(string content, string filePath = "", int fileSize = 1, int fileCount = 20)
        {
            try
            {
                if (!string.IsNullOrWhiteSpace(filePath))
                {
                    logPath = filePath;
                }
                LogLock.EnterWriteLock();
                logPath = logPath.Replace("file:\\", "");//这里为了兼容webapi的情况
                string dataString = DateTime.Now.ToString("yyyy-MM-dd");
                string path = logPath; //+ "\\MyLog";
                if (!Directory.Exists(path))
                {
                    Directory.CreateDirectory(path);
                    path += "\\";
                    path += DateTime.Now.ToString("yyyy-MM-dd") + ".txt";
                    FileStream fs = new FileStream(path, FileMode.Create);
                    fs.Dispose();
                }
                else
                {
                    int x = System.IO.Directory.GetFiles(path).Count();
                    path += "\\";
                    Dictionary<string, DateTime> fileCreateDate = new Dictionary<string, DateTime>();
                    string[] filePathArr = Directory.GetFiles(path, "*.txt", SearchOption.TopDirectoryOnly);
                    if (filePathArr.Length == 0)
                    {
                        string sourceFilePath = path;
                        path += DateTime.Now.ToString("yyyy-MM-dd") + ".txt";
                        FileStream fs = new FileStream(path, FileMode.Create);
                        fs.Dispose();
                        filePathArr = Directory.GetFiles(sourceFilePath, "*.txt", SearchOption.TopDirectoryOnly);
                    }
                    for (int i = 0; i < filePathArr.Length; i++)
                    {
                        FileInfo fi = new FileInfo(filePathArr[i]);
                        fileCreateDate[filePathArr[i]] = fi.LastWriteTime;
                    }
                    fileCreateDate = fileCreateDate.OrderBy(f => f.Value).ToDictionary(f => f.Key, f => f.Value);
                    FileInfo fileInfo = new FileInfo(fileCreateDate.Last().Key);
                    if (fileInfo.Length < 1024 * 1024 * fileSize)
                    {
                        path = fileCreateDate.Last().Key;
                    }
                    else
                    {
                        path += DateTime.Now.ToString("yyyy-MM-dd") + ".txt";
                        FileStream fs = new FileStream(path, FileMode.Create);
                        fs.Dispose();
                    }
                    if (x > fileCount)
                    {
                        File.Delete(fileCreateDate.First().Key);
                    }

                }
                FileStream fs2 = new FileStream(path, FileMode.Open, FileAccess.Write);
                StreamWriter sw = new StreamWriter(fs2);
                long fl = fs2.Length;
                fs2.Seek(fl, SeekOrigin.Begin);
                sw.WriteLine(DateTime.Now.ToString("hh:mm:ss") + "---> " + content);
                sw.Flush();
                sw.Dispose();
                fs2.Dispose();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
            finally
            {
                LogLock.ExitWriteLock();
            }

        }
        #endregion

        #region HtmlToText
        // Static data tables
        protected static Dictionary<string, string> _tags;
        protected static HashSet<string> _ignoreTags;
        // Instance variables
        protected TextBuilder _text;
        protected string _html;
        protected int _pos;
        // Static constructor (one time only)
        static void HtmlToText()
        {
            _tags = new Dictionary<string, string>();
            _tags.Add("address", "\n");
            _tags.Add("blockquote", "\n");
            _tags.Add("div", "\n");
            _tags.Add("dl", "\n");
            _tags.Add("fieldset", "\n");
            _tags.Add("form", "\n");
            _tags.Add("h1", "\n");
            _tags.Add("/h1", "\n");
            _tags.Add("h2", "\n");
            _tags.Add("/h2", "\n");
            _tags.Add("h3", "\n");
            _tags.Add("/h3", "\n");
            _tags.Add("h4", "\n");
            _tags.Add("/h4", "\n");
            _tags.Add("h5", "\n");
            _tags.Add("/h5", "\n");
            _tags.Add("h6", "\n");
            _tags.Add("/h6", "\n");
            _tags.Add("p", "\n");
            _tags.Add("/p", "\n");
            _tags.Add("table", "\n");
            _tags.Add("/table", "\n");
            _tags.Add("ul", "\n");
            _tags.Add("/ul", "\n");
            _tags.Add("ol", "\n");
            _tags.Add("/ol", "\n");
            _tags.Add("/li", "\n");
            _tags.Add("br", "\n");
            _tags.Add("/td", "\t");
            _tags.Add("/tr", "\n");
            _tags.Add("/pre", "\n");
            _ignoreTags = new HashSet<string>();
            _ignoreTags.Add("script");
            _ignoreTags.Add("noscript");
            _ignoreTags.Add("style");
            _ignoreTags.Add("object");
        }
        /// <summary>
        /// Converts the given HTML to plain text and returns the result.
        /// </summary>
        /// <param name="html">HTML to be converted</param>
        /// <returns>Resulting plain text</returns>
        public string Convert(string html)
        {
            HtmlToText();
            // Initialize state variables
            _text = new TextBuilder();
            _html = html;
            _pos = 0;
            // Process input
            while (!EndOfText)
            {
                if (Peek() == '<')
                {
                    // HTML tag
                    bool selfClosing;
                    string tag = ParseTag(out selfClosing);
                    // Handle special tag cases
                    if (tag == "body")
                    {
                        // Discard content before <body>
                        _text.Clear();
                    }
                    else if (tag == "/body")
                    {
                        // Discard content after </body>
                        _pos = _html.Length;
                    }
                    else if (tag == "pre")
                    {
                        // Enter preformatted mode
                        _text.Preformatted = true;
                        EatWhitespaceToNextLine();
                    }
                    else if (tag == "/pre")
                    {
                        // Exit preformatted mode
                        _text.Preformatted = false;
                    }
                    string value;
                    if (_tags.TryGetValue(tag, out value))
                        _text.Write(value);
                    if (_ignoreTags.Contains(tag))
                        EatInnerContent(tag);
                }
                else if (Char.IsWhiteSpace(Peek()))
                {
                    // Whitespace (treat all as space)
                    _text.Write(_text.Preformatted ? Peek() : ' ');
                    MoveAhead();
                }
                else
                {
                    // Other text
                    _text.Write(Peek());
                    MoveAhead();
                }
            }
            // Return result
            return HttpUtility.HtmlDecode(_text.ToString());
        }
        // Eats all characters that are part of the current tag
        // and returns information about that tag
        protected string ParseTag(out bool selfClosing)
        {
            string tag = String.Empty;
            selfClosing = false;
            if (Peek() == '<')
            {
                MoveAhead();
                // Parse tag name
                EatWhitespace();
                int start = _pos;
                if (Peek() == '/')
                    MoveAhead();
                while (!EndOfText && !Char.IsWhiteSpace(Peek()) &&
                  Peek() != '/' && Peek() != '>')
                    MoveAhead();
                tag = _html.Substring(start, _pos - start).ToLower();
                // Parse rest of tag
                while (!EndOfText && Peek() != '>')
                {
                    if (Peek() == '"' || Peek() == '\'')
                        EatQuotedValue();
                    else
                    {
                        if (Peek() == '/')
                            selfClosing = true;
                        MoveAhead();
                    }
                }
                MoveAhead();
            }
            return tag;
        }
        // Consumes inner content from the current tag
        protected void EatInnerContent(string tag)
        {
            string endTag = "/" + tag;
            while (!EndOfText)
            {
                if (Peek() == '<')
                {
                    // Consume a tag
                    bool selfClosing;
                    if (ParseTag(out selfClosing) == endTag)
                        return;
                    // Use recursion to consume nested tags
                    if (!selfClosing && !tag.StartsWith("/"))
                        EatInnerContent(tag);
                }
                else MoveAhead();
            }
        }
        // Returns true if the current position is at the end of
        // the string
        protected bool EndOfText
        {
            get { return (_pos >= _html.Length); }
        }
        // Safely returns the character at the current position
        protected char Peek()
        {
            return (_pos < _html.Length) ? _html[_pos] : (char)0;
        }
        // Safely advances to current position to the next character
        protected void MoveAhead()
        {
            _pos = Math.Min(_pos + 1, _html.Length);
        }
        // Moves the current position to the next non-whitespace
        // character.
        protected void EatWhitespace()
        {
            while (Char.IsWhiteSpace(Peek()))
                MoveAhead();
        }
        // Moves the current position to the next non-whitespace
        // character or the start of the next line, whichever
        // comes first
        protected void EatWhitespaceToNextLine()
        {
            while (Char.IsWhiteSpace(Peek()))
            {
                char c = Peek();
                MoveAhead();
                if (c == '\n')
                    break;
            }
        }
        // Moves the current position past a quoted value
        protected void EatQuotedValue()
        {
            char c = Peek();
            if (c == '"' || c == '\'')
            {
                // Opening quote
                MoveAhead();
                // Find end of value
                int start = _pos;
                _pos = _html.IndexOfAny(new char[] { c, '\r', '\n' }, _pos);
                if (_pos < 0)
                    _pos = _html.Length;
                else
                    MoveAhead();  // Closing quote
            }
        }
        /// <summary>
        /// A StringBuilder class that helps eliminate excess whitespace.
        /// </summary>
        protected class TextBuilder
        {
            private StringBuilder _text;
            private StringBuilder _currLine;
            private int _emptyLines;
            private bool _preformatted;
            // Construction
            public TextBuilder()
            {
                _text = new StringBuilder();
                _currLine = new StringBuilder();
                _emptyLines = 0;
                _preformatted = false;
            }
            /// <summary>
            /// Normally, extra whitespace characters are discarded.
            /// If this property is set to true, they are passed
            /// through unchanged.
            /// </summary>
            public bool Preformatted
            {
                get
                {
                    return _preformatted;
                }
                set
                {
                    if (value)
                    {
                        // Clear line buffer if changing to
                        // preformatted mode
                        if (_currLine.Length > 0)
                            FlushCurrLine();
                        _emptyLines = 0;
                    }
                    _preformatted = value;
                }
            }
            /// <summary>
            /// Clears all current text.
            /// </summary>
            public void Clear()
            {
                _text.Length = 0;
                _currLine.Length = 0;
                _emptyLines = 0;
            }
            /// <summary>
            /// Writes the given string to the output buffer.
            /// </summary>
            /// <param name="s"></param>
            public void Write(string s)
            {
                foreach (char c in s)
                    Write(c);
            }
            /// <summary>
            /// Writes the given character to the output buffer.
            /// </summary>
            /// <param name="c">Character to write</param>
            public void Write(char c)
            {
                if (_preformatted)
                {
                    // Write preformatted character
                    _text.Append(c);
                }
                else
                {
                    if (c == '\r')
                    {
                        // Ignore carriage returns. We'll process
                        // '\n' if it comes next
                    }
                    else if (c == '\n')
                    {
                        // Flush current line
                        FlushCurrLine();
                    }
                    else if (Char.IsWhiteSpace(c))
                    {
                        // Write single space character
                        int len = _currLine.Length;
                        if (len == 0 || !Char.IsWhiteSpace(_currLine[len - 1]))
                            _currLine.Append(' ');
                    }
                    else
                    {
                        // Add character to current line
                        _currLine.Append(c);
                    }
                }
            }
            // Appends the current line to output buffer
            protected void FlushCurrLine()
            {
                // Get current line
                string line = _currLine.ToString().Trim();
                // Determine if line contains non-space characters
                string tmp = line.Replace(" ", String.Empty);
                if (tmp.Length == 0)
                {
                    // An empty line
                    _emptyLines++;
                    if (_emptyLines < 2 && _text.Length > 0)
                        _text.AppendLine(line);
                }
                else
                {
                    // A non-empty line
                    _emptyLines = 0;
                    _text.AppendLine(line);
                }
                // Reset current line
                _currLine.Length = 0;
            }
            /// <summary>
            /// Returns the current output as a string.
            /// </summary>
            public override string ToString()
            {
                if (_currLine.Length > 0)
                    FlushCurrLine();
                return _text.ToString();
            }
        }
        #endregion
    }
}
