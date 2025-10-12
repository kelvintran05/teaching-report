"use client";

import { useState, useEffect } from "react";
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

// Khối theo trường
const GRADES_BY_SCHOOL: Record<string, string[]> = {
  "TH Đinh Bộ Lĩnh": ["Khối 2", "Khối 3", "Khối 4"],
  "TH Huỳnh Văn Chính": ["Khối 1", "Khối 2"],
  "TH Đoàn Thị Điểm": ["Khối 1"],
};

// Lớp theo trường và khối
const CLASSES_BY_SCHOOL_AND_GRADE: Record<string, Record<string, string[]>> = {
  "TH Đinh Bộ Lĩnh": {
    "Khối 2": ["2/1", "2/2"],
    "Khối 3": ["3/1", "3/9"],
    "Khối 4": ["4/2"],
  },
  "TH Huỳnh Văn Chính": {
    "Khối 1": ["1/11", "1/12", "1/13", "1/14"],
    "Khối 2": ["2/4", "2/7"],
  },
  "TH Đoàn Thị Điểm": {
    "Khối 1": ["1/17", "1/18"],
  },
};

const SESSIONS = ["Sáng", "Chiều"];
const TAS = ["Ngọc An", "Yến Nhi", "Uyên", "Minh Truyền", "Không có trợ giảng"];
const TA_COMMENT_SUGGEST =
  "Trợ giảng biết việc, bao quát lớp tuy nhiên vẫn chưa thực sự xử lí tốt các tình huống, trang phục chưa phù hợp";
const CLASS_STATUS_SUGGEST =
  "Tình hình cơ sở vật chất: Ti vi sử dụng bình thường";

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

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = (values: any) => {
    const newItem: Item = {
      id: editingId || crypto.randomUUID(),
      date: values.date.format("YYYY-MM-DD"),
      schoolName: values.schoolName,
      session: values.session,
      period: values.period || "",
      className: values.className,
      lessonName: values.lessonName,
      ta: values.ta || "",
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
      setAvailableClasses(
        CLASSES_BY_SCHOOL_AND_GRADE[item.schoolName]?.[gradeName] || []
      );
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
      setAvailableClasses(
        CLASSES_BY_SCHOOL_AND_GRADE[selectedSchool]?.[gradeName] || []
      );
    } else {
      setAvailableClasses([]);
    }
    // Reset className khi đổi khối
    form.setFieldValue("className", undefined);
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
                  >
                    {SCHOOLS.map((s) => (
                      <Select.Option key={s} value={s}>
                        {s}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
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
                  >
                    {availableClasses.map((c) => (
                      <Select.Option key={c} value={c}>
                        {c}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
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
                  <Select placeholder="Chọn trợ giảng" allowClear>
                    {TAS.map((t) => (
                      <Select.Option key={t} value={t}>
                        {t}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
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
      </div>
    </div>
  );
}
