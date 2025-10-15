"use client";

import { useState, useEffect, useRef } from "react";
import {
  Form,
  DatePicker,
  Select,
  Input,
  Button,
  Table,
  Space,
  message,
  Modal,
  Card,
  Typography,
  Row,
  Col,
  Tooltip,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  FileExcelOutlined,
  PrinterOutlined,
  CopyOutlined,
  EyeOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import * as XLSX from "xlsx";
import ExcelJS from "exceljs";
import dynamic from "next/dynamic";

const { TextArea } = Input;
const { Title, Text } = Typography;

type Item = {
  id: string;
  date: string;
  schoolName: string;
  session: string;
  period: string;
  className: string[]; // Multi-select array
  lessonName: string;
  ta: string;
  classStatus: string;
  selfEvaluation: string;
  taComment: string;
};

const SCHOOLS = ["TH Đinh Bộ Lĩnh", "TH Huỳnh Văn Chính", "TH Đoàn Thị Điểm"];

// Thông tin chi tiết về các trường
const SCHOOL_INFO: Record<string, { address: string; totalClasses: number }> = {
  "TH Đinh Bộ Lĩnh": {
    address: "91B Bờ Bao Tân Thắng, P. Sơn Kỳ, Q. Tân Phú",
    totalClasses: 52,
  },
  "TH Huỳnh Văn Chính": {
    address: "39 Huỳnh Thiện Lộc, Phú Trung, Tân Phú, TP.HCM",
    totalClasses: 28,
  },
  "TH Đoàn Thị Điểm": {
    address: "Địa chỉ TH Đoàn Thị Điểm",
    totalClasses: 2,
  },
};

// Khối theo trường
const GRADES_BY_SCHOOL: Record<string, string[]> = {
  "TH Đinh Bộ Lĩnh": ["Khối 1", "Khối 2", "Khối 3", "Khối 4", "Khối 5"],
  "TH Huỳnh Văn Chính": ["Khối 1", "Khối 2", "Khối 3"],
  "TH Đoàn Thị Điểm": ["Khối 1"],
};

// Lớp theo trường và khối (dựa trên thời khóa biểu thực tế)
const CLASSES_BY_SCHOOL_AND_GRADE: Record<string, Record<string, string[]>> = {
  "TH Đinh Bộ Lĩnh": {
    "Khối 1": ["1/1", "1/2", "1/3", "1/4", "1/5", "1/6", "1/7", "1/8", "1/9"],
    "Khối 2": ["2/1", "2/2", "2/3", "2/4", "2/5", "2/6", "2/7", "2/8", "2/9"],
    "Khối 3": [
      "3/1",
      "3/2",
      "3/3",
      "3/4",
      "3/5",
      "3/6",
      "3/7",
      "3/8",
      "3/9",
      "3/10",
      "3/11",
    ],
    "Khối 4": [
      "4/1",
      "4/2",
      "4/3",
      "4/4",
      "4/5",
      "4/6",
      "4/7",
      "4/8",
      "4/9",
      "4/10",
      "4/11",
    ],
    "Khối 5": [
      "5/1",
      "5/2",
      "5/3",
      "5/4",
      "5/5",
      "5/6",
      "5/7",
      "5/8",
      "5/9",
      "5/10",
      "5/11",
      "5/12",
    ],
  },
  "TH Huỳnh Văn Chính": {
    "Khối 1": [
      "1/1",
      "1/2",
      "1/3",
      "1/4",
      "1/5",
      "1/6",
      "1/7",
      "1/8",
      "1/9",
      "1/10",
      "1/11",
      "1/12",
      "1/13",
      "1/14",
    ],
    "Khối 2": [
      "2/1",
      "2/2",
      "2/3",
      "2/4",
      "2/5",
      "2/6",
      "2/7",
      "2/8",
      "2/9",
      "2/10",
      "2/11",
      "2/12",
    ],
    "Khối 3": [
      "3/1",
      "3/2",
      "3/3",
      "3/4",
      "3/5",
      "3/7",
      "3/8",
      "3/9",
      "3/10",
      "3/11",
      "3/12",
    ],
  },
  "TH Đoàn Thị Điểm": {
    "Khối 1": ["1/17", "1/18"],
  },
};

const SESSIONS = ["Sáng", "Chiều"];
const TAS = [
  // TH Đinh Bộ Lĩnh
  "Phúc Hảo",
  "Thanh Hằng",
  "Mỹ Duyên",
  "Nhật Hào",
  "Thuý Bình",
  "Minh Khải",
  "Thanh Tú",
  "Anh Thư",
  "Khánh Linh",
  "Bảo Trân",
  "Trần Thắng",
  // TH Huỳnh Văn Chính
  "Ngọc An",
  "Yến Nhi",
  "Uyên",
  "Minh Truyền",
  "Thuý Bình",
  "Không có trợ giảng",
  "Khác",
];
const TA_COMMENT_SUGGEST =
  "Trợ giảng biết việc, bao quát lớp tuy nhiên vẫn chưa thực sự xử lí tốt các tình huống, trang phục chưa phù hợp";
const CLASS_STATUS_SUGGEST =
  "Tình hình cơ sở vật chất: Ti vi sử dụng bình thường";

// Thời khóa biểu mẫu dựa trên hình ảnh thực tế
const TIMETABLE_DATA: Record<string, any> = {
  "TH Đinh Bộ Lĩnh": {
    morning: {
      "Thứ 2": { classes: ["5/10"], teacher: "Phụng Nhi", ta: "Phúc Hảo" },
      "Thứ 3": { classes: [], teacher: "Phụng Nhi", ta: "Thanh Hằng" },
      "Thứ 4": {
        classes: ["1/7", "5/9", "1/5", "2/5"],
        teacher: "Phụng Nhi",
        ta: "Mỹ Duyên",
      },
      "Thứ 5": { classes: [], teacher: "Minh Chí", ta: "Nhật Hào" },
      "Thứ 6": {
        classes: [
          "5/5",
          "1/9",
          "2/4",
          "1/6",
          "5/6",
          "1/8",
          "1/4",
          "5/12",
          "5/8",
          "2/6",
        ],
        teacher: "Ngọc Trâm",
        ta: "Mỹ Duyên",
      },
      "Thứ 7": {
        classes: ["5/7", "5/4", "2/7"],
        teacher: "Phụng Nhi",
        ta: "Thuý Bình",
      },
    },
    afternoon: {
      "Thứ 2": {
        classes: ["2/1", "3/1", "4/1"],
        teacher: "Hoàng Anh",
        ta: "Minh Khải",
      },
      "Thứ 3": {
        classes: ["1/2", "3/3", "2/2"],
        teacher: "Quốc Thắng",
        ta: "Minh Khải",
      },
      "Thứ 4": {
        classes: ["4/4", "4/2", "1/3", "3/9", "4/3", "1/1", "2/9", "4/5"],
        teacher: "Hoàng Anh",
        ta: "Thanh Tú",
      },
      "Thứ 5": {
        classes: ["4/7", "3/2", "3/8", "2/3", "2/8", "5/2", "3/6"],
        teacher: "Phụng Nhi",
        ta: "Anh Thư",
      },
      "Thứ 6": {
        classes: ["4/11", "4/8", "3/4", "5/3", "3/10", "5/1", "4/9"],
        teacher: "Minh Chí",
        ta: "Thanh Tú",
      },
      "Thứ 7": {
        classes: ["3/7", "4/10", "3/5", "4/6", "3/11"],
        teacher: "Ngọc Trâm",
        ta: "Anh Thư",
      },
    },
  },
  "TH Huỳnh Văn Chính": {
    morning: {
      "Thứ 2": { classes: [], teacher: "", ta: "" },
      "Thứ 3": {
        classes: ["2/8", "2/9", "3/9", "3/10", "3/11", "3/12"],
        teacher: "Yến Ngọc",
        ta: "Bảo Trân",
      },
      "Thứ 4": { classes: [], teacher: "", ta: "" },
      "Thứ 5": {
        classes: ["3/7", "3/8", "2/10", "2/11", "2/12"],
        teacher: "Yến Ngọc",
        ta: "-",
      },
      "Thứ 6": { classes: [], teacher: "", ta: "" },
    },
    afternoon: {
      "Thứ 2": {
        classes: ["1/2", "1/3", "1/3", "1/5", "1/8"],
        teacher: "Yến Ngọc",
        ta: "Thuý Bình",
      },
      "Thứ 3": {
        classes: ["2/4", "2/4", "1/12", "1/13", "1/14", "1/4", "1/11"],
        teacher: "Hoàng Anh",
        ta: "Yến Nhi",
      },
      "Thứ 4": {
        classes: ["2/3", "2/3", "1/6", "2/6"],
        teacher: "Yến Ngọc",
        ta: "Minh Truyền",
      },
      "Thứ 5": {
        classes: ["3/5", "3/5", "2/2", "2/7", "2/1"],
        teacher: "Ngọc Nhi",
        ta: "Khánh Linh",
      },
      "Thứ 6": {
        classes: [
          "1/1",
          "1/7",
          "3/3",
          "1/9",
          "1/10",
          "3/1",
          "2/5",
          "3/4",
          "3/2",
        ],
        teacher: "Tuyết Nhung",
        ta: "Bảo Trân",
      },
    },
  },
};

export default function BuilderPage() {
  const teacher = "Huỳnh Thị Hoàng Anh";
  const [form] = Form.useForm();
  const [items, setItems] = useState<Item[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [html, setHtml] = useState<string | null>(null);
  const [selectedSchool, setSelectedSchool] = useState<string>("");
  const [selectedGrade, setSelectedGrade] = useState<string>("");
  const [availableGrades, setAvailableGrades] = useState<string[]>([]);
  const [availableClasses, setAvailableClasses] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showCustomTA, setShowCustomTA] = useState(false);
  const [showCustomClass, setShowCustomClass] = useState(false);
  const [customTAValue, setCustomTAValue] = useState("");
  const [customClassValue, setCustomClassValue] = useState("");
  const [parsedCustomClasses, setParsedCustomClasses] = useState<string[]>([]);
  const [calendarVisible, setCalendarVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = (values: any) => {
    // Handle custom TA value
    let finalTA = values.ta || "";
    if (values.ta === "Khác" && customTAValue.trim()) {
      finalTA = customTAValue.trim();
    }

    // Handle custom class value
    let finalClassName = values.className || [];
    if (
      Array.isArray(finalClassName) &&
      finalClassName.includes("Khác") &&
      parsedCustomClasses.length > 0
    ) {
      // Replace "Khác" with parsed custom classes
      finalClassName = finalClassName
        .filter((c: string) => c !== "Khác")
        .concat(parsedCustomClasses);
    }

    const newItem: Item = {
      id: editingId || crypto.randomUUID(),
      date: values.date.format("YYYY-MM-DD"),
      schoolName: values.schoolName,
      session: values.session,
      period: values.period || "",
      className: finalClassName,
      lessonName: values.lessonName,
      ta: finalTA,
      classStatus: values.classStatus || "",
      selfEvaluation: values.selfEvaluation || "",
      taComment: values.taComment || "",
    };

    if (editingId) {
      setItems(items.map((it) => (it.id === editingId ? newItem : it)));
      message.success({
        content: "✅ Đã cập nhật hoạt động thành công!",
        duration: 3,
      });
    } else {
      setItems([...items, newItem]);
      message.success({
        content: "🎉 Đã thêm hoạt động mới vào danh sách!",
        duration: 3,
      });
    }

    form.resetFields();
    setEditingId(null);
    setSelectedSchool("");
    setSelectedGrade("");
    setAvailableGrades([]);
    setAvailableClasses([]);
    setShowCustomTA(false);
    setShowCustomClass(false);
    setCustomTAValue("");
    setCustomClassValue("");
    setParsedCustomClasses([]);
  };

  const handleEdit = (item: Item) => {
    setEditingId(item.id);
    setSelectedSchool(item.schoolName);

    // Load grades cho trường
    const grades = GRADES_BY_SCHOOL[item.schoolName] || [];
    setAvailableGrades(grades);

    // Tìm grade từ className (lấy số đầu tiên từ className đầu tiên)
    const firstClass = item.className[0];
    const gradeNumber = firstClass ? firstClass.split("/")[0] : "";
    const gradeName = gradeNumber ? `Khối ${gradeNumber}` : "";

    setSelectedGrade(gradeName);

    // Load classes cho grade
    if (gradeName) {
      const classes =
        CLASSES_BY_SCHOOL_AND_GRADE[item.schoolName]?.[gradeName] || [];
      setAvailableClasses([...classes, "Khác"]);
    }

    form.setFieldsValue({
      date: dayjs(item.date),
      schoolName: item.schoolName,
      gradeName: gradeName,
      session: item.session,
      period: item.period,
      className: item.className,
      lessonName: item.lessonName,
      ta: item.ta,
      classStatus: item.classStatus,
      selfEvaluation: item.selfEvaluation,
      taComment: item.taComment,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSchoolChange = (schoolName: string) => {
    setSelectedSchool(schoolName);
    setAvailableGrades(GRADES_BY_SCHOOL[schoolName] || []);
    setSelectedGrade("");
    setAvailableClasses([]);
    // Reset grade và className khi đổi trường
    form.setFieldValue("gradeName", undefined);
    form.setFieldValue("className", undefined);
  };

  const handleGradeChange = (gradeName: string) => {
    setSelectedGrade(gradeName);
    if (selectedSchool && gradeName) {
      const classes =
        CLASSES_BY_SCHOOL_AND_GRADE[selectedSchool]?.[gradeName] || [];
      setAvailableClasses([...classes, "Khác"]);
    } else {
      setAvailableClasses([]);
    }
    // Reset className khi đổi khối
    form.setFieldValue("className", undefined);
    setShowCustomClass(false);
    setCustomClassValue("");
    setParsedCustomClasses([]);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc muốn xóa hoạt động này?",
      okText: "Xóa",
      cancelText: "Hủy",
      okType: "danger",
      onOk: () => {
        setItems(items.filter((it) => it.id !== id));
        message.success({
          content: "🗑️ Đã xóa hoạt động khỏi danh sách",
          duration: 2,
        });
      },
    });
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    message.success({
      content: "📋 Đã sao chép vào clipboard!",
      duration: 2,
    });
  };

  const exportToExcel = async () => {
    try {
      const dates = items.map((it) => it.date).filter((d) => d);
      const startDate = dates.length > 0 ? dates.sort()[0] : "";
      const endDate = dates.length > 0 ? dates.sort()[dates.length - 1] : "";

      // Đọc file template với ExcelJS
      const response = await fetch("/template_report.xlsx");
      const arrayBuffer = await response.arrayBuffer();

      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(arrayBuffer);

      // Lấy worksheet đầu tiên
      const worksheet = workbook.worksheets[0];

      // Lấy style mẫu từ dòng 2 (header row) để copy sang data rows
      const headerRow = worksheet.getRow(2);

      // Fill dữ liệu vào template (bắt đầu từ dòng 3)
      items.forEach((item, idx) => {
        const rowNum = idx + 3;
        const row = worksheet.getRow(rowNum);

        // Helper function để copy style từ header và set value
        const setCellWithStyle = (
          colNum: number,
          value: any,
          align: "center" | "left" = "center"
        ) => {
          const cell = row.getCell(colNum);
          const headerCell = headerRow.getCell(colNum);

          // Cells với text nhiều dòng nên dùng vertical "top"
          // Columns: G(7)-Tên bài, H(8)-Tự đánh giá, I(9)-Tình hình tiết học, J(10)-Nhận xét TA
          const isMultiLineCell = [7, 8, 9, 10].includes(colNum);

          // Copy style từ header nhưng bỏ bold và đảm bảo border
          cell.style = {
            ...headerCell.style,
            font: {
              ...headerCell.style.font,
              bold: false, // Data không bold
            },
            border: {
              top: { style: "thin", color: { argb: "FF000000" } },
              left: { style: "thin", color: { argb: "FF000000" } },
              bottom: { style: "thin", color: { argb: "FF000000" } },
              right: { style: "thin", color: { argb: "FF000000" } },
            },
            alignment: {
              horizontal: align,
              vertical: isMultiLineCell ? "top" : "middle",
              wrapText: true, // Cho phép text wrap và giữ line breaks (\n)
            },
          };
          cell.value = value;
        };

        // A: Ngày - canh giữa
        setCellWithStyle(
          1,
          item.date ? dayjs(item.date).format("DD/MM/YYYY") : "",
          "center"
        );

        // B: Thứ - canh giữa
        setCellWithStyle(
          2,
          item.date
            ? `Thứ ${
                dayjs(item.date).day() === 0 ? "CN" : dayjs(item.date).day() + 1
              }`
            : "",
          "center"
        );

        // C: Trường - canh trái
        setCellWithStyle(3, item.schoolName, "left");

        // D: Lớp - canh giữa (join array with comma)
        setCellWithStyle(4, item.className.join(","), "center");

        // E: Buổi - Tiết - canh giữa (VD: C3, S2)
        const sessionCode = item.session === "Sáng" ? "S" : "C";
        const sessionPeriod = item.period
          ? `${sessionCode}${item.period}`
          : item.session;
        setCellWithStyle(5, sessionPeriod, "center");

        // F: Trợ giảng - canh giữa
        setCellWithStyle(6, item.ta || "", "center");

        // G: Tên bài - canh trái
        setCellWithStyle(7, item.lessonName, "left");

        // H: Tự nhận xét - canh trái
        setCellWithStyle(8, item.selfEvaluation || "", "left");

        // I: Tình hình tiết học - canh trái
        setCellWithStyle(9, item.classStatus || "", "left");

        // J: Nhận xét trợ giảng - canh trái
        setCellWithStyle(10, item.taComment || "", "left");

        // Tính toán row height dựa trên số dòng trong text
        const textFields = [
          item.lessonName || "",
          item.classStatus || "",
          item.selfEvaluation || "",
          item.taComment || "",
        ];

        // Tìm số dòng nhiều nhất (đếm \n + 1)
        const maxLines = Math.max(
          ...textFields.map((text) => (text.match(/\n/g) || []).length + 1),
          1
        );

        // Base height 22, mỗi dòng thêm ~16 pixels (để fit text tốt hơn)
        row.height = Math.max(22, maxLines * 16 + 6);

        row.commit();
      });

      // Cập nhật dòng 1 với tuần range
      const titleRow = worksheet.getRow(1);
      const titleCell = titleRow.getCell(1);
      const weekRangeTitle = `${dayjs(startDate).format("DD/MM")} - ${dayjs(
        endDate
      ).format("DD/MM")}`;
      titleCell.value = `BÁO CÁO CÔNG VIỆC TUẦN (${weekRangeTitle})`;
      titleRow.commit();

      // Xuất file
      const weekRange = `${dayjs(startDate).format("DD.MM")} - ${dayjs(
        endDate
      ).format("DD.MM")}`;
      const fileName = `VNLS2526 - Báo cáo công việc Tuần (${weekRange}) - ${teacher}.xlsx`;

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.click();
      window.URL.revokeObjectURL(url);

      message.success({
        content:
          "📥 Đã tải xuống file Excel thành công! Kiểm tra thư mục Downloads",
        duration: 4,
      });
    } catch (error) {
      console.error("Error:", error);
      message.error({
        content: "❌ Có lỗi xảy ra khi xuất file Excel. Vui lòng thử lại!",
        duration: 3,
      });
    }
  };

  async function generatePreview() {
    const dates = items.map((it) => it.date).filter((d) => d);
    const startDate = dates.length > 0 ? dates.sort()[0] : "";
    const endDate = dates.length > 0 ? dates.sort()[dates.length - 1] : "";

    const rows = items.map((it) => {
      const sessionCode = it.session === "Sáng" ? "S" : "C";
      const sessionPeriod = it.period
        ? `${sessionCode}${it.period}`
        : it.session;

      return {
        date: it.date ? dayjs(it.date).format("DD/MM/YYYY") : "",
        weekday: it.date
          ? `Thứ ${
              dayjs(it.date).day() === 0 ? "CN" : dayjs(it.date).day() + 1
            }`
          : "",
        school_name: it.schoolName,
        class: it.className.join(","),
        session: sessionPeriod,
        topic: it.lessonName,
        ta: it.ta || "—",
        classStatus: it.classStatus || "—",
        selfEvaluation: it.selfEvaluation || "—",
        taComment: it.taComment || "—",
      };
    });

    const data = {
      week_range:
        startDate && endDate
          ? `${dayjs(startDate).format("DD/MM")} - ${dayjs(endDate).format(
              "DD/MM/YYYY"
            )}`
          : "",
      teacher: teacher,
      generated_at: new Date().toLocaleString("vi-VN"),
      items: rows,
    };

    try {
      const res = await fetch("/api/fill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateName: "teaching-weekly", data }),
      });
      if (!res.ok) throw new Error("Không thể tạo preview");
      const text = await res.text();
      setHtml(text);
      setPreviewVisible(true);
    } catch (e: any) {
      message.error(e.message);
    }
  }

  const downloadTemplate = () => {
    // Create a sample Excel template for users to fill
    const template = [
      {
        Ngày: "10/10/2024",
        Trường: "TH Đinh Bộ Lĩnh",
        Buổi: "Sáng",
        Tiết: "1",
        Lớp: "2/1,2/2",
        "Tên bài": "Toán - Phép cộng trong phạm vi 20",
        "Trợ giảng": "Ngọc An",
        "Tình hình tiết học":
          "Tình hình cơ sở vật chất: Ti vi sử dụng bình thường",
        "Tự đánh giá": "Học sinh tham gia tích cực",
        "Nhận xét TA":
          "Trợ giảng biết việc, bao quát lớp tuy nhiên vẫn chưa thực sự xử lí tốt các tình huống",
      },
      {
        Ngày: "11/10/2024",
        Trường: "TH Huỳnh Văn Chính",
        Buổi: "Chiều",
        Tiết: "3",
        Lớp: "1/12",
        "Tên bài": "Tiếng Việt - Luyện đọc",
        "Trợ giảng": "Yến Nhi",
        "Tình hình tiết học": "Lớp học yên tĩnh, máy chiếu hoạt động tốt",
        "Tự đánh giá": "Bài giảng đạt mục tiêu",
        "Nhận xét TA": "Trợ giảng hỗ trợ tốt",
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(template);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template");

    // Auto-size columns
    const maxWidth = 30;
    const colWidths = [
      { wch: 12 }, // Ngày
      { wch: 20 }, // Trường
      { wch: 10 }, // Buổi
      { wch: 8 }, // Tiết
      { wch: 15 }, // Lớp
      { wch: maxWidth }, // Tên bài
      { wch: 15 }, // Trợ giảng
      { wch: maxWidth }, // Tình hình
      { wch: maxWidth }, // Tự đánh giá
      { wch: maxWidth }, // Nhận xét TA
    ];
    worksheet["!cols"] = colWidths;

    XLSX.writeFile(workbook, "Template_Import_Hoat_Dong.xlsx");

    message.success({
      content: "📥 Đã tải file template Excel mẫu!",
      duration: 3,
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Try to detect file type by checking first row
        const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1");
        const firstCellValue = worksheet["A1"]?.v || "";

        // Check if it's an output file (starts with "BÁO CÁO CÔNG VIỆC")
        const isOutputFile = firstCellValue
          .toString()
          .includes("BÁO CÁO CÔNG VIỆC");

        // For output files, skip first row (title) and use row 2 as header
        const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, {
          range: isOutputFile ? 1 : 0, // Start from row 2 if output file
        });

        if (jsonData.length === 0) {
          message.warning("File Excel không có dữ liệu!");
          return;
        }

        // Debug: Log first row columns to help troubleshoot
        if (jsonData.length > 0) {
          console.log("📊 Excel columns detected:", Object.keys(jsonData[0]));
        }

        // Parse data from Excel to Item format
        const importedItems: Item[] = jsonData
          .map((row, index) => {
            try {
              // Map Excel columns to Item fields
              // Support both template format and output format
              const date = row["Ngày"] || row["Date"] || row["date"];
              const schoolName =
                row["Trường"] || row["School"] || row["schoolName"];

              // Handle session and period
              let session = "";
              let period = "";

              // Check if "Buổi - Tiết" column exists (output format)
              // Try multiple variants with different spacing
              const sessionPeriod =
                row["Buổi - Tiết"] ||
                row["Buổi-Tiết"] ||
                row["Buổi- Tiết"] ||
                row["Buổi -Tiết"] ||
                row["Buoi - Tiet"] ||
                Object.keys(row).find(
                  (key) =>
                    key
                      .replace(/\s+/g, "")
                      .toLowerCase()
                      .includes("buổitiết") ||
                    key.replace(/\s+/g, "").toLowerCase().includes("buoitiet")
                )
                  ? row[
                      Object.keys(row).find(
                        (key) =>
                          key
                            .replace(/\s+/g, "")
                            .toLowerCase()
                            .includes("buổitiết") ||
                          key
                            .replace(/\s+/g, "")
                            .toLowerCase()
                            .includes("buoitiet")
                      )!
                    ]
                  : undefined;

              if (sessionPeriod) {
                // Parse "S1" → session="Sáng", period="1"
                // Parse "C3" → session="Chiều", period="3"
                const match = sessionPeriod
                  .toString()
                  .trim()
                  .match(/^([SC])(\d+)$/);
                if (match) {
                  session = match[1] === "S" ? "Sáng" : "Chiều";
                  period = match[2];
                }
              } else {
                // Template format: separate columns
                session = row["Buổi"] || row["Session"] || row["session"] || "";
                period = row["Tiết"] || row["Period"] || row["period"] || "";
              }

              const className =
                row["Lớp"] || row["Class"] || row["className"] || "";
              const lessonName =
                row["Tên bài"] || row["Lesson"] || row["lessonName"];

              // Try multiple variants for TA column
              const ta =
                row["Trợ giảng"] ||
                row["Tro giang"] ||
                row["TA"] ||
                row["ta"] ||
                Object.keys(row).find(
                  (key) =>
                    key
                      .replace(/\s+/g, "")
                      .toLowerCase()
                      .includes("trợgiảng") ||
                    key.replace(/\s+/g, "").toLowerCase().includes("trogiang")
                )
                  ? row[
                      Object.keys(row).find(
                        (key) =>
                          key
                            .replace(/\s+/g, "")
                            .toLowerCase()
                            .includes("trợgiảng") ||
                          key
                            .replace(/\s+/g, "")
                            .toLowerCase()
                            .includes("trogiang")
                      )!
                    ]
                  : "";

              // Handle different column names for status and evaluations
              const classStatus =
                row["Tình hình tiết học"] ||
                row["Tình hình"] ||
                row["Status"] ||
                row["classStatus"] ||
                "";
              const selfEvaluation =
                row["Tự nhận xét"] || // Output format
                row["Tự đánh giá"] || // Template format
                row["Self Evaluation"] ||
                row["selfEvaluation"] ||
                "";
              const taComment =
                row["Nhận xét trợ giảng"] || // Output format
                row["Nhận xét TA"] || // Template format
                row["TA Comment"] ||
                row["taComment"] ||
                "";

              if (!date || !schoolName || !lessonName) {
                return null; // Skip invalid rows
              }

              // Parse date
              let parsedDate = "";
              if (typeof date === "number") {
                // Excel serial date
                const excelDate = XLSX.SSF.parse_date_code(date);
                parsedDate = dayjs(
                  new Date(excelDate.y, excelDate.m - 1, excelDate.d)
                ).format("YYYY-MM-DD");
              } else {
                // Try to parse string date (DD/MM/YYYY or YYYY-MM-DD)
                const dateStr = date.toString();
                if (dateStr.includes("/")) {
                  // Assume DD/MM/YYYY
                  const parts = dateStr.split("/");
                  if (parts.length === 3) {
                    parsedDate = dayjs(
                      `${parts[2]}-${parts[1]}-${parts[0]}`
                    ).format("YYYY-MM-DD");
                  }
                } else {
                  parsedDate = dayjs(date).format("YYYY-MM-DD");
                }
              }

              // Parse className to array
              const classNameArray = className
                .toString()
                .split(/[,;]/)
                .map((c: string) => c.trim())
                .filter((c: string) => c);

              return {
                id: `${Date.now()}-${index}-${Math.random()}`,
                date: parsedDate,
                schoolName: schoolName.toString().trim(),
                session: session.toString().trim(),
                period: period.toString().trim(),
                className: classNameArray,
                lessonName: lessonName.toString().trim(),
                ta: ta.toString().trim(),
                classStatus: classStatus.toString().trim(),
                selfEvaluation: selfEvaluation.toString().trim(),
                taComment: taComment.toString().trim(),
              };
            } catch (error) {
              console.error(`Error parsing row ${index}:`, error);
              return null;
            }
          })
          .filter((item): item is Item => item !== null);

        if (importedItems.length === 0) {
          message.error(
            "Không thể đọc dữ liệu từ file! Vui lòng kiểm tra định dạng file."
          );
          return;
        }

        // Add imported items to existing items
        setItems((prevItems) => [...prevItems, ...importedItems]);

        const fileType = isOutputFile ? "file báo cáo" : "file template";
        message.success({
          content: `📥 Đã import thành công ${importedItems.length} hoạt động từ ${fileType}!`,
          duration: 4,
        });
      } catch (error) {
        console.error("Error reading file:", error);
        message.error({
          content: "❌ Có lỗi khi đọc file Excel. Vui lòng thử lại!",
          duration: 3,
        });
      }
    };
    reader.readAsArrayBuffer(file);

    // Reset input để có thể upload lại cùng file
    event.target.value = "";
  };

  const handlePrint = () => {
    if (!html) return;
    const w = window.open("", "_blank");
    if (w) {
      w.document.write(html);
      w.document.close();
      w.focus();
      w.print();
    }
  };

  const columns = [
    {
      title: "Ngày",
      dataIndex: "date",
      key: "date",
      render: (date: string) => dayjs(date).format("DD/MM/YYYY"),
      width: 100,
    },
    {
      title: "Trường",
      dataIndex: "schoolName",
      key: "schoolName",
      width: 150,
    },
    {
      title: "Buổi - Tiết",
      dataIndex: "session",
      key: "session",
      width: 100,
      render: (_: any, record: Item) => {
        const sessionCode = record.session === "Sáng" ? "S" : "C";
        return record.period
          ? `${sessionCode}${record.period}`
          : record.session;
      },
    },
    {
      title: "Lớp",
      dataIndex: "className",
      key: "className",
      width: 150,
      render: (classNames: string[]) => classNames.join(", "),
    },
    {
      title: "Tên bài",
      dataIndex: "lessonName",
      key: "lessonName",
      width: 200,
    },
    {
      title: "Trợ giảng",
      dataIndex: "ta",
      key: "ta",
      width: 120,
    },
    {
      title: "Hành động",
      key: "action",
      width: 100,
      fixed: "right" as const,
      render: (_: any, record: Item) => (
        <Space size="small">
          <Tooltip title="Chỉnh sửa hoạt động này">
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              size="small"
              style={{
                background: "linear-gradient(135deg, #96E6B3 0%, #D4FCE7 100%)",
                border: "none",
                color: "#2F8F5F",
                boxShadow: "0 2px 8px rgba(150, 230, 179, 0.25)",
              }}
            />
          </Tooltip>
          <Tooltip title="Xóa hoạt động này">
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id)}
              size="small"
              style={{
                boxShadow: "0 2px 8px rgba(255, 77, 79, 0.25)",
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // Calendar component
  const renderTimetableCalendar = () => {
    if (!selectedSchool || !TIMETABLE_DATA[selectedSchool]) {
      return <div>Chưa có dữ liệu thời khóa biểu cho trường này</div>;
    }

    const timetable = TIMETABLE_DATA[selectedSchool];
    const days = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];

    return (
      <div style={{ padding: "20px" }}>
        <div
          style={{
            textAlign: "center",
            marginBottom: "30px",
            padding: "20px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            borderRadius: "16px",
            color: "white",
          }}
        >
          <div
            style={{ fontSize: "24px", fontWeight: "700", marginBottom: "8px" }}
          >
            📅 Thời khóa biểu
          </div>
          <div style={{ fontSize: "18px", opacity: 0.9 }}>{selectedSchool}</div>
        </div>

        <Row gutter={[16, 16]}>
          {/* Morning Session */}
          <Col xs={24} lg={12}>
            <Card
              title={
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#0284c7",
                  }}
                >
                  🌅 Buổi Sáng
                </div>
              }
              style={{
                height: "100%",
                borderRadius: "12px",
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
                border: "1px solid #e2e8f0",
              }}
              headStyle={{
                background: "linear-gradient(135deg, #e0f2fe 0%, #b3e5fc 100%)",
                borderBottom: "1px solid #0284c7",
                borderRadius: "12px 12px 0 0",
                padding: "12px 16px",
              }}
              bodyStyle={{
                padding: "0",
                borderRadius: "0 0 12px 12px",
              }}
            >
              <div style={{ overflowX: "auto", padding: "16px" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    borderRadius: "8px",
                    overflow: "hidden",
                    fontSize: "13px",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
                  }}
                >
                  <thead>
                    <tr style={{ backgroundColor: "#f8fafc" }}>
                      <th
                        style={{
                          padding: "12px 8px",
                          border: "1px solid #e2e8f0",
                          textAlign: "center",
                          fontWeight: "600",
                          fontSize: "12px",
                          color: "#475569",
                          backgroundColor: "#f8fafc",
                        }}
                      >
                        Thứ
                      </th>
                      <th
                        style={{
                          padding: "12px 8px",
                          border: "1px solid #e2e8f0",
                          textAlign: "center",
                          fontWeight: "600",
                          fontSize: "12px",
                          color: "#475569",
                          backgroundColor: "#f8fafc",
                        }}
                      >
                        Lớp
                      </th>
                      <th
                        style={{
                          padding: "12px 8px",
                          border: "1px solid #e2e8f0",
                          textAlign: "center",
                          fontWeight: "600",
                          fontSize: "12px",
                          color: "#475569",
                          backgroundColor: "#f8fafc",
                        }}
                      >
                        Giáo viên
                      </th>
                      <th
                        style={{
                          padding: "12px 8px",
                          border: "1px solid #e2e8f0",
                          textAlign: "center",
                          fontWeight: "600",
                          fontSize: "12px",
                          color: "#475569",
                          backgroundColor: "#f8fafc",
                        }}
                      >
                        Trợ giảng
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {days.map((day) => {
                      const dayData = timetable.morning[day];
                      return (
                        <tr
                          key={day}
                          style={{
                            backgroundColor:
                              dayData?.classes?.length > 0
                                ? "#ffffff"
                                : "#fafbfc",
                            transition: "all 0.2s ease",
                          }}
                        >
                          <td
                            style={{
                              padding: "12px 8px",
                              border: "1px solid #e2e8f0",
                              fontWeight: "600",
                              fontSize: "12px",
                              color: "#374151",
                              backgroundColor:
                                dayData?.classes?.length > 0
                                  ? "#fef3c7"
                                  : "#f3f4f6",
                              textAlign: "center",
                            }}
                          >
                            {day}
                          </td>
                          <td
                            style={{
                              padding: "12px 8px",
                              border: "1px solid #e2e8f0",
                              fontSize: "12px",
                              color: "#1f2937",
                              backgroundColor:
                                dayData?.classes?.length > 0
                                  ? "#ffffff"
                                  : "#fafbfc",
                            }}
                          >
                            {dayData?.classes?.length > 0 ? (
                              <div
                                style={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: "3px",
                                  justifyContent: "center",
                                }}
                              >
                                {dayData.classes.map(
                                  (cls: string, idx: number) => (
                                    <span
                                      key={idx}
                                      style={{
                                        backgroundColor: "#dbeafe",
                                        color: "#1e40af",
                                        padding: "2px 6px",
                                        borderRadius: "4px",
                                        fontSize: "11px",
                                        fontWeight: "500",
                                        whiteSpace: "nowrap",
                                      }}
                                    >
                                      {cls}
                                    </span>
                                  )
                                )}
                              </div>
                            ) : (
                              <span
                                style={{
                                  color: "#9ca3af",
                                  fontStyle: "italic",
                                  fontSize: "11px",
                                }}
                              >
                                -
                              </span>
                            )}
                          </td>
                          <td
                            style={{
                              padding: "12px 8px",
                              border: "1px solid #e2e8f0",
                              fontSize: "12px",
                              color: "#1f2937",
                              backgroundColor:
                                dayData?.classes?.length > 0
                                  ? "#ffffff"
                                  : "#fafbfc",
                              textAlign: "center",
                            }}
                          >
                            {dayData?.teacher ? (
                              <span
                                style={{
                                  fontWeight: "500",
                                  color: "#059669",
                                  fontSize: "11px",
                                }}
                              >
                                {dayData.teacher}
                              </span>
                            ) : (
                              <span
                                style={{
                                  color: "#9ca3af",
                                  fontStyle: "italic",
                                  fontSize: "11px",
                                }}
                              >
                                -
                              </span>
                            )}
                          </td>
                          <td
                            style={{
                              padding: "12px 8px",
                              border: "1px solid #e2e8f0",
                              fontSize: "12px",
                              color: "#1f2937",
                              backgroundColor:
                                dayData?.classes?.length > 0
                                  ? "#ffffff"
                                  : "#fafbfc",
                              textAlign: "center",
                            }}
                          >
                            {dayData?.ta && dayData.ta !== "-" ? (
                              <span
                                style={{
                                  fontWeight: "500",
                                  color: "#7c3aed",
                                  fontSize: "11px",
                                }}
                              >
                                {dayData.ta}
                              </span>
                            ) : (
                              <span
                                style={{
                                  color: "#9ca3af",
                                  fontStyle: "italic",
                                  fontSize: "11px",
                                }}
                              >
                                -
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </Col>

          {/* Afternoon Session */}
          <Col xs={24} lg={12}>
            <Card
              title={
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#0284c7",
                  }}
                >
                  🌆 Buổi Chiều
                </div>
              }
              style={{
                height: "100%",
                borderRadius: "12px",
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.08)",
                border: "1px solid #e2e8f0",
              }}
              headStyle={{
                background: "linear-gradient(135deg, #e0f2fe 0%, #b3e5fc 100%)",
                borderBottom: "1px solid #0284c7",
                borderRadius: "12px 12px 0 0",
                padding: "12px 16px",
              }}
              bodyStyle={{
                padding: "0",
                borderRadius: "0 0 12px 12px",
              }}
            >
              <div style={{ overflowX: "auto", padding: "16px" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    borderRadius: "8px",
                    overflow: "hidden",
                    fontSize: "13px",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
                  }}
                >
                  <thead>
                    <tr style={{ backgroundColor: "#f8fafc" }}>
                      <th
                        style={{
                          padding: "12px 8px",
                          border: "1px solid #e2e8f0",
                          textAlign: "center",
                          fontWeight: "600",
                          fontSize: "12px",
                          color: "#475569",
                          backgroundColor: "#f8fafc",
                        }}
                      >
                        Thứ
                      </th>
                      <th
                        style={{
                          padding: "12px 8px",
                          border: "1px solid #e2e8f0",
                          textAlign: "center",
                          fontWeight: "600",
                          fontSize: "12px",
                          color: "#475569",
                          backgroundColor: "#f8fafc",
                        }}
                      >
                        Lớp
                      </th>
                      <th
                        style={{
                          padding: "12px 8px",
                          border: "1px solid #e2e8f0",
                          textAlign: "center",
                          fontWeight: "600",
                          fontSize: "12px",
                          color: "#475569",
                          backgroundColor: "#f8fafc",
                        }}
                      >
                        Giáo viên
                      </th>
                      <th
                        style={{
                          padding: "12px 8px",
                          border: "1px solid #e2e8f0",
                          textAlign: "center",
                          fontWeight: "600",
                          fontSize: "12px",
                          color: "#475569",
                          backgroundColor: "#f8fafc",
                        }}
                      >
                        Trợ giảng
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {days.map((day) => {
                      const dayData = timetable.afternoon[day];
                      return (
                        <tr
                          key={day}
                          style={{
                            backgroundColor:
                              dayData?.classes?.length > 0
                                ? "#ffffff"
                                : "#fafbfc",
                            transition: "all 0.2s ease",
                          }}
                        >
                          <td
                            style={{
                              padding: "12px 8px",
                              border: "1px solid #e2e8f0",
                              fontWeight: "600",
                              fontSize: "12px",
                              color: "#374151",
                              backgroundColor:
                                dayData?.classes?.length > 0
                                  ? "#fef3c7"
                                  : "#f3f4f6",
                              textAlign: "center",
                            }}
                          >
                            {day}
                          </td>
                          <td
                            style={{
                              padding: "12px 8px",
                              border: "1px solid #e2e8f0",
                              fontSize: "12px",
                              color: "#1f2937",
                              backgroundColor:
                                dayData?.classes?.length > 0
                                  ? "#ffffff"
                                  : "#fafbfc",
                            }}
                          >
                            {dayData?.classes?.length > 0 ? (
                              <div
                                style={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: "3px",
                                  justifyContent: "center",
                                }}
                              >
                                {dayData.classes.map(
                                  (cls: string, idx: number) => (
                                    <span
                                      key={idx}
                                      style={{
                                        backgroundColor: "#dbeafe",
                                        color: "#1e40af",
                                        padding: "2px 6px",
                                        borderRadius: "4px",
                                        fontSize: "11px",
                                        fontWeight: "500",
                                        whiteSpace: "nowrap",
                                      }}
                                    >
                                      {cls}
                                    </span>
                                  )
                                )}
                              </div>
                            ) : (
                              <span
                                style={{
                                  color: "#9ca3af",
                                  fontStyle: "italic",
                                  fontSize: "11px",
                                }}
                              >
                                -
                              </span>
                            )}
                          </td>
                          <td
                            style={{
                              padding: "12px 8px",
                              border: "1px solid #e2e8f0",
                              fontSize: "12px",
                              color: "#1f2937",
                              backgroundColor:
                                dayData?.classes?.length > 0
                                  ? "#ffffff"
                                  : "#fafbfc",
                              textAlign: "center",
                            }}
                          >
                            {dayData?.teacher ? (
                              <span
                                style={{
                                  fontWeight: "500",
                                  color: "#059669",
                                  fontSize: "11px",
                                }}
                              >
                                {dayData.teacher}
                              </span>
                            ) : (
                              <span
                                style={{
                                  color: "#9ca3af",
                                  fontStyle: "italic",
                                  fontSize: "11px",
                                }}
                              >
                                -
                              </span>
                            )}
                          </td>
                          <td
                            style={{
                              padding: "12px 8px",
                              border: "1px solid #e2e8f0",
                              fontSize: "12px",
                              color: "#1f2937",
                              backgroundColor:
                                dayData?.classes?.length > 0
                                  ? "#ffffff"
                                  : "#fafbfc",
                              textAlign: "center",
                            }}
                          >
                            {dayData?.ta && dayData.ta !== "-" ? (
                              <span
                                style={{
                                  fontWeight: "500",
                                  color: "#7c3aed",
                                  fontSize: "11px",
                                }}
                              >
                                {dayData.ta}
                              </span>
                            ) : (
                              <span
                                style={{
                                  color: "#9ca3af",
                                  fontStyle: "italic",
                                  fontSize: "11px",
                                }}
                              >
                                -
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    );
  };

  if (!mounted) {
    return null;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "40px 24px",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* Hero Header */}
        <div
          className="hero-header"
          style={{
            background:
              "linear-gradient(135deg, #FFB6C1 0%, #FFF0F5 50%, #E6F3FF 100%)",
            borderRadius: "32px",
            padding: "48px 40px",
            marginBottom: "32px",
            boxShadow: "0 8px 32px rgba(255, 182, 193, 0.25)",
            position: "relative",
            overflow: "hidden",
            border: "3px solid rgba(255, 255, 255, 0.8)",
          }}
        >
          <div
            className="decorative-circle"
            style={{
              position: "absolute",
              top: "-80px",
              right: "-80px",
              width: "250px",
              height: "250px",
              background: "rgba(255, 255, 255, 0.3)",
              borderRadius: "50%",
            }}
          />
          <div
            className="decorative-circle"
            style={{
              position: "absolute",
              bottom: "-60px",
              left: "-60px",
              width: "180px",
              height: "180px",
              background: "rgba(173, 216, 230, 0.2)",
              borderRadius: "50%",
            }}
          />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ textAlign: "center" }}>
              <div
                className="header-icon"
                style={{
                  fontSize: "64px",
                  marginBottom: "20px",
                  filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.1))",
                }}
              >
                🎓
              </div>
              <Title
                level={1}
                style={{
                  color: "#D04770",
                  marginBottom: "12px",
                  fontSize: "36px",
                  fontWeight: "700",
                  textShadow: "0 2px 4px rgba(208, 71, 112, 0.1)",
                  letterSpacing: "0.5px",
                }}
              >
                Báo Cáo Giảng Dạy Hàng Tuần
              </Title>
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.85)",
                  backdropFilter: "blur(10px)",
                  display: "inline-block",
                  padding: "14px 32px",
                  borderRadius: "20px",
                  marginTop: "8px",
                  border: "2px solid rgba(255, 182, 193, 0.3)",
                  boxShadow: "0 4px 12px rgba(255, 182, 193, 0.2)",
                }}
              >
                <Text
                  style={{
                    color: "#D04770",
                    fontSize: "17px",
                    fontWeight: "600",
                  }}
                >
                  👩‍🏫 Giáo viên: <strong>{teacher}</strong>
                </Text>
              </div>
            </div>
          </div>
        </div>

        <Card
          className="form-card"
          title={
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "#D04770",
                }}
              >
                <span
                  style={{
                    width: "42px",
                    height: "42px",
                    background:
                      "linear-gradient(135deg, #FFB6C1 0%, #FFE4E9 100%)",
                    borderRadius: "14px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "22px",
                    boxShadow: "0 3px 10px rgba(255, 182, 193, 0.3)",
                  }}
                >
                  {editingId ? "✏️" : "📝"}
                </span>
                {editingId ? "Chỉnh sửa hoạt động" : "Thêm hoạt động mới"}
              </div>
              <Space size="middle">
                <Tooltip title="Tải file Excel mẫu để điền dữ liệu">
                  <Button
                    icon={<FileExcelOutlined />}
                    size="large"
                    onClick={downloadTemplate}
                    style={{
                      borderRadius: "12px",
                      border: "2px solid #FFB6C1",
                      color: "#D04770",
                      fontWeight: "600",
                      height: "40px",
                      padding: "0 20px",
                      background: "transparent",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#FFF5F8";
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow =
                        "0 4px 12px rgba(255, 182, 193, 0.3)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    📋 Template
                  </Button>
                </Tooltip>
                <Tooltip title="Upload file Excel để import dữ liệu hàng loạt">
                  <Button
                    icon={<UploadOutlined />}
                    size="large"
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      borderRadius: "12px",
                      border: "2px solid #96E6B3",
                      color: "#2F8F5F",
                      fontWeight: "600",
                      height: "40px",
                      padding: "0 20px",
                      background: "transparent",
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        "linear-gradient(135deg, #96E6B3 0%, #D4FCE7 100%)";
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow =
                        "0 4px 12px rgba(150, 230, 179, 0.3)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    📤 Upload
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileUpload}
                    style={{ display: "none" }}
                  />
                </Tooltip>
              </Space>
            </div>
          }
          style={{
            marginBottom: "32px",
            borderRadius: "24px",
            boxShadow: "0 6px 24px rgba(255, 182, 193, 0.15)",
            border: "2px solid rgba(255, 182, 193, 0.2)",
            overflow: "hidden",
          }}
          headStyle={{
            background: "linear-gradient(135deg, #FFF5F8 0%, #F0F9FF 100%)",
            borderBottom: "2px solid rgba(255, 182, 193, 0.2)",
            padding: "22px 28px",
          }}
          bodyStyle={{ padding: "36px" }}
        >
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Row gutter={16}>
              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  label="📅 Ngày"
                  name="date"
                  rules={[{ required: true, message: "Vui lòng chọn ngày" }]}
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    format="DD/MM/YYYY"
                    placeholder="Chọn ngày"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  label="🏫 Tên trường"
                  name="schoolName"
                  rules={[{ required: true, message: "Vui lòng chọn trường" }]}
                >
                  <Select
                    placeholder="Chọn trường"
                    onChange={handleSchoolChange}
                    style={{
                      borderRadius: "12px",
                      border: "2px solid #e8f4fd",
                    }}
                    dropdownStyle={{
                      borderRadius: "12px",
                      border: "2px solid #e8f4fd",
                      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    {SCHOOLS.map((s) => (
                      <Select.Option
                        key={s}
                        value={s}
                        style={{
                          padding: "12px 16px",
                          borderRadius: "8px",
                          margin: "4px 8px",
                        }}
                      >
                        <div
                          style={{
                            fontWeight: "600",
                            color: "#1f2937",
                            fontSize: "14px",
                          }}
                        >
                          {s}
                        </div>
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                {selectedSchool && SCHOOL_INFO[selectedSchool] && (
                  <div
                    style={{
                      marginTop: "8px",
                      padding: "8px 12px",
                      backgroundColor: "#f0f9ff",
                      borderRadius: "8px",
                      fontSize: "12px",
                      color: "#0369a1",
                    }}
                  >
                    📍 <strong>{SCHOOL_INFO[selectedSchool].address}</strong>
                    <div style={{ marginTop: "4px" }}>
                      <Button
                        type="link"
                        size="small"
                        onClick={() => setCalendarVisible(true)}
                        style={{ padding: 0, height: "auto" }}
                      >
                        📅 Xem thời khóa biểu
                      </Button>
                    </div>
                  </div>
                )}
              </Col>

              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  label="📚 Khối"
                  name="gradeName"
                  rules={[{ required: true, message: "Vui lòng chọn khối" }]}
                >
                  <Select
                    placeholder={
                      selectedSchool
                        ? "Chọn khối"
                        : "Vui lòng chọn trường trước"
                    }
                    disabled={!selectedSchool}
                    onChange={handleGradeChange}
                  >
                    {availableGrades.map((g) => (
                      <Select.Option key={g} value={g}>
                        {g}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  label="🌅 Buổi"
                  name="session"
                  rules={[{ required: true, message: "Vui lòng chọn buổi" }]}
                >
                  <Select placeholder="Chọn buổi">
                    {SESSIONS.map((s) => (
                      <Select.Option key={s} value={s}>
                        {s}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  label="⏰ Tiết"
                  name="period"
                  rules={[{ required: true, message: "Vui lòng nhập tiết" }]}
                >
                  <Input
                    placeholder="VD: 1, 2, 3..."
                    type="number"
                    min="1"
                    max="10"
                    className="number-input-no-spinner"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item
                  label="👥 Tên lớp (có thể chọn nhiều)"
                  name="className"
                  rules={[
                    { required: true, message: "Vui lòng chọn ít nhất 1 lớp" },
                  ]}
                >
                  <Select
                    mode="multiple"
                    placeholder={
                      selectedGrade
                        ? "Chọn một hoặc nhiều lớp"
                        : "Vui lòng chọn khối trước"
                    }
                    disabled={!selectedGrade}
                    maxTagCount="responsive"
                    onChange={(values) => {
                      setShowCustomClass(
                        Array.isArray(values) && values.includes("Khác")
                      );
                      if (!values.includes("Khác")) {
                        setCustomClassValue("");
                        setParsedCustomClasses([]);
                      }
                    }}
                  >
                    {availableClasses.map((c) => (
                      <Select.Option key={c} value={c}>
                        {c}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                {showCustomClass && (
                  <Form.Item
                    label="📝 Nhập tên lớp"
                    help="Ví dụ: 3/7,4/1,5/3 (có thể nhập lớp từ nhiều khối khác nhau)"
                  >
                    <Input
                      placeholder="Nhập tên lớp (có thể nhập nhiều lớp cách nhau bởi dấu phẩy)"
                      value={customClassValue}
                      onChange={(e) => {
                        const value = e.target.value;
                        setCustomClassValue(value);

                        // Parse và validate các lớp được nhập
                        if (value.trim()) {
                          const classes = value
                            .split(/[,;]/)
                            .map((c: string) => c.trim())
                            .filter((c: string) => c && /^\d+\/\d+$/.test(c));
                          setParsedCustomClasses(classes);
                        } else {
                          setParsedCustomClasses([]);
                        }
                      }}
                      style={{
                        borderRadius: "12px",
                        border: "2px solid #e8f4fd",
                      }}
                    />
                    {parsedCustomClasses.length > 0 && (
                      <div
                        style={{
                          marginTop: "8px",
                          fontSize: "12px",
                          color: "#52c41a",
                        }}
                      >
                        ✅ Đã nhận diện {parsedCustomClasses.length} lớp:{" "}
                        {parsedCustomClasses.join(", ")}
                      </div>
                    )}
                  </Form.Item>
                )}
              </Col>

              <Col xs={24} sm={12}>
                <Form.Item
                  label="📖 Tên bài"
                  name="lessonName"
                  rules={[{ required: true, message: "Vui lòng nhập tên bài" }]}
                >
                  <Input placeholder="VD: Toán - Phép cộng trong phạm vi 20" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item label="🤝 Tên trợ giảng" name="ta">
                  <Select
                    placeholder="Chọn trợ giảng"
                    allowClear
                    onChange={(value) => {
                      setShowCustomTA(value === "Khác");
                      if (value !== "Khác") {
                        setCustomTAValue("");
                      }
                    }}
                  >
                    {TAS.map((t) => (
                      <Select.Option key={t} value={t}>
                        {t}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                {showCustomTA && (
                  <Form.Item label="📝 Nhập tên trợ giảng">
                    <Input
                      placeholder="Nhập tên trợ giảng"
                      value={customTAValue}
                      onChange={(e) => setCustomTAValue(e.target.value)}
                      style={{
                        borderRadius: "12px",
                        border: "2px solid #e8f4fd",
                      }}
                    />
                  </Form.Item>
                )}
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24} md={12}>
                <Form.Item
                  label={
                    <Space>
                      <span>🖥️ Tình hình tiết học</span>
                      <Button
                        type="link"
                        size="small"
                        onClick={() =>
                          form.setFieldValue(
                            "classStatus",
                            CLASS_STATUS_SUGGEST
                          )
                        }
                      >
                        📝 Dùng gợi ý
                      </Button>
                    </Space>
                  }
                  name="classStatus"
                >
                  <TextArea
                    autoSize={{ minRows: 5, maxRows: 10 }}
                    placeholder="Mô tả tình hình lớp, cơ sở vật chất hoặc nhấn 'Dùng gợi ý'"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item label="⭐ Tự đánh giá" name="selfEvaluation">
                  <TextArea
                    autoSize={{ minRows: 5, maxRows: 10 }}
                    placeholder="Tự đánh giá về buổi học..."
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col xs={24}>
                <Form.Item
                  label={
                    <Space>
                      <span>💬 Nhận xét trợ giảng</span>
                      <Button
                        type="link"
                        size="small"
                        onClick={() =>
                          form.setFieldValue("taComment", TA_COMMENT_SUGGEST)
                        }
                      >
                        📝 Dùng gợi ý
                      </Button>
                    </Space>
                  }
                  name="taComment"
                >
                  <TextArea
                    autoSize={{ minRows: 5, maxRows: 10 }}
                    placeholder="Nhận xét về trợ giảng hoặc nhấn 'Dùng gợi ý'"
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item style={{ marginTop: "24px" }}>
              <Space size="large">
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  className="submit-button"
                  style={{
                    background:
                      "linear-gradient(135deg, #FFB6C1 0%, #FFE4E9 100%)",
                    border: "none",
                    borderRadius: "16px",
                    height: "52px",
                    padding: "0 40px",
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#C7385F",
                    boxShadow: "0 4px 15px rgba(255, 182, 193, 0.4)",
                  }}
                >
                  {editingId
                    ? "💾 Cập nhật hoạt động"
                    : "✨ Thêm vào danh sách"}
                </Button>
                {editingId && (
                  <Button
                    size="large"
                    onClick={() => {
                      form.resetFields();
                      setEditingId(null);
                      setSelectedSchool("");
                      setSelectedGrade("");
                      setAvailableGrades([]);
                      setAvailableClasses([]);
                      setShowCustomTA(false);
                      setShowCustomClass(false);
                      setCustomTAValue("");
                      setCustomClassValue("");
                      setParsedCustomClasses([]);
                    }}
                    style={{
                      borderRadius: "16px",
                      height: "52px",
                      padding: "0 40px",
                      fontSize: "16px",
                      fontWeight: "500",
                      borderWidth: "2px",
                      borderColor: "#FFB6C1",
                      color: "#D04770",
                      background: "white",
                      boxShadow: "0 2px 8px rgba(255, 182, 193, 0.2)",
                    }}
                  >
                    ✕ Hủy bỏ
                  </Button>
                )}
              </Space>
            </Form.Item>
          </Form>
        </Card>

        {items.length > 0 && (
          <>
            <Card
              className="activities-card"
              title={
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    fontSize: "18px",
                    fontWeight: "600",
                    color: "#7B68A6",
                  }}
                >
                  <span
                    style={{
                      width: "42px",
                      height: "42px",
                      background:
                        "linear-gradient(135deg, #D4C5F9 0%, #E8E0FF 100%)",
                      borderRadius: "14px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "22px",
                      boxShadow: "0 3px 10px rgba(212, 197, 249, 0.3)",
                    }}
                  >
                    📚
                  </span>
                  Danh sách hoạt động ({items.length} hoạt động)
                </div>
              }
              extra={
                <Space size="middle">
                  <Tooltip title="Tải xuống file Excel với định dạng đẹp">
                    <Button
                      type="primary"
                      icon={<FileExcelOutlined />}
                      onClick={exportToExcel}
                      size="large"
                      className="excel-button"
                      style={{
                        background:
                          "linear-gradient(135deg, #96E6B3 0%, #D4FCE7 100%)",
                        border: "none",
                        borderRadius: "16px",
                        height: "52px",
                        padding: "0 32px",
                        fontWeight: "600",
                        color: "#2F8F5F",
                        boxShadow: "0 4px 16px rgba(150, 230, 179, 0.3)",
                      }}
                    >
                      Tải Excel
                    </Button>
                  </Tooltip>
                  <Tooltip title="Xem trước báo cáo trước khi in hoặc lưu">
                    <Button
                      icon={<EyeOutlined />}
                      onClick={generatePreview}
                      size="large"
                      className="preview-button"
                      style={{
                        borderRadius: "16px",
                        height: "52px",
                        padding: "0 32px",
                        fontWeight: "600",
                        borderColor: "#D4C5F9",
                        borderWidth: "2px",
                        color: "#7B68A6",
                        background: "white",
                      }}
                    >
                      Xem Preview
                    </Button>
                  </Tooltip>
                </Space>
              }
              style={{
                marginBottom: "32px",
                borderRadius: "24px",
                boxShadow: "0 6px 24px rgba(212, 197, 249, 0.2)",
                border: "2px solid rgba(212, 197, 249, 0.3)",
              }}
              headStyle={{
                background: "linear-gradient(135deg, #F9F7FF 0%, #EFF6FF 100%)",
                borderBottom: "2px solid rgba(212, 197, 249, 0.2)",
                padding: "22px 28px",
              }}
              bodyStyle={{ padding: "28px" }}
            >
              <Table
                columns={columns}
                dataSource={items}
                rowKey="id"
                scroll={{ x: 1200 }}
                pagination={false}
              />
            </Card>
          </>
        )}

        {items.length === 0 && (
          <Card
            className="empty-state"
            style={{
              textAlign: "center",
              padding: "80px 48px",
              borderRadius: "28px",
              boxShadow:
                "0 8px 32px rgba(255, 182, 193, 0.15), inset 0 1px 0 rgba(255,255,255,0.5)",
              border: "3px dashed rgba(255, 182, 193, 0.4)",
              background: "linear-gradient(135deg, #FFFAFC 0%, #F0F9FF 100%)",
            }}
          >
            <div
              className="empty-icon"
              style={{
                width: "150px",
                height: "150px",
                margin: "0 auto 32px",
                background: "linear-gradient(135deg, #FFB6C1 0%, #E8E0FF 100%)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "72px",
                boxShadow:
                  "0 12px 32px rgba(255, 182, 193, 0.3), 0 0 0 8px rgba(255, 182, 193, 0.1)",
              }}
            >
              📝
            </div>
            <Title
              level={2}
              style={{
                marginBottom: "16px",
                color: "#D04770",
                fontSize: "28px",
              }}
            >
              Bắt đầu ghi nhận hoạt động giảng dạy
            </Title>
            <Text
              style={{
                fontSize: "17px",
                color: "#7B68A6",
                display: "block",
                marginTop: "12px",
                lineHeight: "1.6",
              }}
            >
              📚 Hãy thêm các tiết học, lớp học và hoạt động giảng dạy của bạn
            </Text>
            <div
              style={{
                marginTop: "24px",
                padding: "20px",
                background: "rgba(255, 255, 255, 0.7)",
                borderRadius: "16px",
                border: "1px solid rgba(255, 182, 193, 0.2)",
              }}
            >
              <Text
                style={{
                  fontSize: "14px",
                  color: "#A0A0B0",
                  display: "block",
                  lineHeight: "1.8",
                }}
              >
                💡 <strong>Hướng dẫn:</strong> Điền thông tin vào form bên trên
                <br />
                ✅ Chọn ngày, trường, lớp, và các thông tin cần thiết
                <br />✨ Nhấn "Thêm vào danh sách" để lưu hoạt động
              </Text>
            </div>
          </Card>
        )}

        <Modal
          title={
            <div
              style={{
                fontSize: "20px",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                color: "#7B68A6",
              }}
            >
              <span
                style={{
                  width: "40px",
                  height: "40px",
                  background:
                    "linear-gradient(135deg, #D4C5F9 0%, #E8E0FF 100%)",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "20px",
                  boxShadow: "0 3px 10px rgba(212, 197, 249, 0.3)",
                }}
              >
                <EyeOutlined />
              </span>
              Preview Báo Cáo
            </div>
          }
          open={previewVisible}
          onCancel={() => setPreviewVisible(false)}
          width="90%"
          footer={[
            <Button
              key="close"
              onClick={() => setPreviewVisible(false)}
              size="large"
              style={{
                borderRadius: "16px",
                height: "48px",
                padding: "0 28px",
                fontSize: "16px",
                fontWeight: "500",
                borderWidth: "2px",
                borderColor: "#FFE4E9",
              }}
            >
              ✕ Đóng
            </Button>,
            <Button
              key="print"
              type="primary"
              icon={<PrinterOutlined />}
              onClick={handlePrint}
              size="large"
              style={{
                background: "linear-gradient(135deg, #D4C5F9 0%, #E8E0FF 100%)",
                border: "none",
                borderRadius: "16px",
                height: "48px",
                padding: "0 32px",
                fontSize: "16px",
                fontWeight: "600",
                color: "#7B68A6",
                boxShadow: "0 4px 16px rgba(212, 197, 249, 0.3)",
              }}
            >
              🖨️ In PDF
            </Button>,
          ]}
          styles={{
            body: { padding: "28px" },
          }}
        >
          {html && (
            <div
              style={{
                border: "2px solid #e8e8e8",
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
            >
              <iframe
                srcDoc={html}
                style={{ width: "100%", height: "700px", border: "none" }}
              />
            </div>
          )}
        </Modal>

        {/* Calendar Modal */}
        <Modal
          title={
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
                fontWeight: "600",
                color: "#7B68A6",
              }}
            >
              <span
                style={{
                  marginRight: "12px",
                  padding: "8px 12px",
                  backgroundColor: "#f0f9ff",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "20px",
                  boxShadow: "0 3px 10px rgba(212, 197, 249, 0.3)",
                }}
              >
                📅
              </span>
              Thời khóa biểu
            </div>
          }
          open={calendarVisible}
          onCancel={() => setCalendarVisible(false)}
          width="95%"
          footer={[
            <Button
              key="close"
              onClick={() => setCalendarVisible(false)}
              size="large"
              style={{
                borderRadius: "16px",
                height: "48px",
                padding: "0 32px",
                fontSize: "16px",
                fontWeight: "600",
              }}
            >
              ✨ Đóng
            </Button>,
          ]}
          styles={{
            body: { padding: "0" },
          }}
        >
          {renderTimetableCalendar()}
        </Modal>
      </div>
    </div>
  );
}
