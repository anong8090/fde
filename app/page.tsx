'use client';

import React, { useState, useEffect } from "react";
import {
  ApprovalFormData,
  AttachmentFile,
  PushTaskItem,
  FdeAnalysisResult,
  FdeAgentTraceStep,
  KnowledgeDocument,
  DocCategory,
  WorkflowNode,
  CrossCheckItem
} from "@/types/fde";
import { MOCK_CASES, INITIAL_PUSH_TASKS } from "@/lib/mock-cases";
import {
  CATEGORY_DEFINITIONS,
  INITIAL_KNOWLEDGE_DOCUMENTS
} from "@/lib/knowledge-base";
import { runFdeAnalysis } from "@/lib/fde-engine";

// 规范、沉稳的企业级单色线性 SVG 图标
const IconInbox = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12"></polyline>
    <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"></path>
  </svg>
);

const IconLedger = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
    <path d="M9 14l2 2 4-4"></path>
  </svg>
);

const IconBook = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
  </svg>
);

const IconAudit = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

export default function FdeEnterpriseApp() {
  // 全局宏观主菜单：待办审批、已办台账、规章制度库
  const [globalNav, setGlobalNav] = useState<"TASK_LIST" | "DETAIL_VIEW" | "KNOWLEDGE_BASE" | "AUDIT_LEDGER">("TASK_LIST");

  // 详情页内部页签：1. 业务审查核批 (3 大板块)；2. AI 审计推演日志 (面向客户化)
  const [detailTab, setDetailTab] = useState<"REVIEW" | "AUDIT_LOG">("REVIEW");

  // 待办任务池
  const [tasks, setTasks] = useState<PushTaskItem[]>(INITIAL_PUSH_TASKS);

  // 当前呈批单据数据
  const [currentTask, setCurrentTask] = useState<PushTaskItem>(INITIAL_PUSH_TASKS[0]);
  const [formData, setFormData] = useState<ApprovalFormData>(MOCK_CASES[0].formData);
  const [attachments, setAttachments] = useState<AttachmentFile[]>(MOCK_CASES[0].attachments);
  const [workflowNodes, setWorkflowNodes] = useState<WorkflowNode[]>(MOCK_CASES[0].defaultWorkflow);

  // 分析与推演状态
  const [loading, setLoading] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<FdeAnalysisResult | null>(null);
  const [traceSteps, setTraceSteps] = useState<FdeAgentTraceStep[]>([]);
  const [logs, setLogs] = useState<string[]>([]);

  // 板块三：当前审批人（严格仅限赵志远本人）专属签批表单状态
  const [approvalVerdict, setApprovalVerdict] = useState<"APPROVED" | "REQUIRE_SUPPLEMENT" | "REJECT">("APPROVED");
  const [humanReviewNote, setHumanReviewNote] = useState<string>("");
  const [ackCompliance, setAckCompliance] = useState<boolean>(true);
  const [signedCertificate, setSignedCertificate] = useState<{
    signTime: string;
    certNo: string;
    sm2Hash: string;
    verdictLabel: string;
    callbackTicket: string;
    sourceSystem: string;
  } | null>(null);

  // 节点历史意见查看弹窗
  const [viewingNodeOpinion, setViewingNodeOpinion] = useState<WorkflowNode | null>(null);

  // 导出红头公文模态窗
  const [showDocModal, setShowDocModal] = useState<boolean>(false);

  // 规章制度知识库状态
  const [knowledgeDocs, setKnowledgeDocs] = useState<KnowledgeDocument[]>(INITIAL_KNOWLEDGE_DOCUMENTS);
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  // 待办审批与审批台账搜索状态
  const [taskSearchKeyword, setTaskSearchKeyword] = useState<string>("");
  const [ledgerSearchKeyword, setLedgerSearchKeyword] = useState<string>("");
  // 待办审批池多维风险筛选与台账流转状态
  const [taskRiskFilter, setTaskRiskFilter] = useState<"ALL" | "HIGH_RISK" | "WARNING" | "NORMAL">("ALL");
  const [ledgerTab, setLedgerTab] = useState<"ALL" | "ARCHIVED">("ALL");

  // 随附原件与证据穿透模态框状态
  const [viewingAttachment, setViewingAttachment] = useState<AttachmentFile | null>(null);
  const [viewingEvidenceItem, setViewingEvidenceItem] = useState<CrossCheckItem | null>(null);
  const [viewingRegulation, setViewingRegulation] = useState<{
    ruleName: string;
    clause: string;
    snippet: string;
    applicability: string;
    docNo?: string;
    issuingBody?: string;
  } | null>(null);
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [selectedDocForChunks, setSelectedDocForChunks] = useState<KnowledgeDocument | null>(null);

  // 上传新规章表单状态
  const [newDocTitle, setNewDocTitle] = useState("");
  const [newDocCategory, setNewDocCategory] = useState<DocCategory>("INTERNAL_RULE");
  const [newDocNo, setNewDocNo] = useState("");
  const [newDocVersion, setNewDocVersion] = useState("v2026.1 现行版");
  const [newDocIssuingBody, setNewDocIssuingBody] = useState("");
  const [newDocSummary, setNewDocSummary] = useState("");
  const [newDocClause, setNewDocClause] = useState("");
  const [uploadingStage, setUploadingStage] = useState<string>("");

  // 初始化执行初审及支持 URL 参数路由
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const view = params.get("view");
      const caseId = params.get("case");
      const tab = params.get("tab");

      if (caseId) {
        const found = INITIAL_PUSH_TASKS.find((t) => t.id === caseId);
        if (found) {
          handleOpenTask(found);
          if (tab === "AUDIT_LOG") {
            setDetailTab("AUDIT_LOG");
          }
          if (params.get("signed") === "true") {
            setSignedCertificate({
              signTime: "2026-09-05 20:50:18",
              certNo: `CFCA-SOE-2026-${found.id.replace("REQ-", "")}`,
              sm2Hash: "SM2_SIG_E7B492A08C14F3D69A1C50B3E84F17DA810C29E4",
              verdictLabel: "退回补正",
              callbackTicket: `ACK-OA-20260905-${found.id.replace("REQ-", "")}`,
              sourceSystem: found.sourceSystem
            });
          }
          return;
        }
      }

      if (view === "KNOWLEDGE_BASE" || view === "AUDIT_LEDGER" || view === "DETAIL_VIEW" || view === "TASK_LIST") {
        setGlobalNav(view);
      }
      if (tab === "REVIEW" || tab === "AUDIT_LOG") {
        setDetailTab(tab);
      }
      if (params.get("signed") === "true") {
        setSignedCertificate({
          signTime: "2026-09-05 20:50:18",
          certNo: "CFCA-SOE-2026-202609-001",
          sm2Hash: "SM2_SIG_E7B492A08C14F3D69A1C50B3E84F17DA810C29E4",
          verdictLabel: "退回补正",
          callbackTicket: "ACK-OA-20260905-882194",
          sourceSystem: "OA协同办公系统"
        });
      }
    }
    executeAnalysis(formData, attachments);
  }, []);

  const executeAnalysis = (data: ApprovalFormData, atts: AttachmentFile[]) => {
    setLoading(true);
    const output = runFdeAnalysis(data, atts);
    setAnalysisResult(output.result);
    setTraceSteps(output.traceSteps);
    setLogs(output.logs);
    setWorkflowNodes(output.result.workflowNodes);
    setLoading(false);

    // 默认根据 AI 初审风险给出推荐批注
    if (output.result.overallVerdict === "HIGH_RISK_WARNING") {
      setApprovalVerdict("REJECT");
      setHumanReviewNote("【坚决否决退回】：经审查，合同约定 95% 出厂合格率严重违背集团《食品质量合规规范》99.8% 底线且免除第三方 CMA 报告。坚决否决，请研发中心立即退回并启动备选供方评审。");
    } else if (output.result.overallVerdict === "REQUIRE_SUPPLEMENT") {
      setApprovalVerdict("REQUIRE_SUPPLEMENT");
      setHumanReviewNote("【退回补正材料】：经审查，呈批单申报金额与附件清单存在 5 万元勾稽差额，且未附党委会“三重一大”前置纪要文号，请经办人与财务处核实补齐后重新报审。");
    } else {
      setApprovalVerdict("APPROVED");
      setHumanReviewNote("【准予通过呈批】：经核验，合同全要素与送审附件一致，入围资质完备，无合规或资金风险。准予批准签署，请承办部门严格按约组织履约与质检。");
    }
  };

  // 从待办列表中点击进入“业务详情”
  const handleOpenTask = (task: PushTaskItem) => {
    setCurrentTask(task);
    const matchedCase = MOCK_CASES.find((c) => c.id === task.caseId) || MOCK_CASES[0];
    const newForm = JSON.parse(JSON.stringify(matchedCase.formData));
    const newAtts = JSON.parse(JSON.stringify(matchedCase.attachments));
    setFormData(newForm);
    setAttachments(newAtts);
    setDetailTab("REVIEW");

    // 还原历史反馈状态（如已反馈）
    if (task.status === "APPROVED" || task.status === "REJECTED") {
      setSignedCertificate({
        signTime: task.humanSignOffAt || "2026-09-05 20:50",
        certNo: `CFCA-SOE-2026-${task.id.replace("REQ-", "")}`,
        sm2Hash: "SM2_SIG_E7B492A08C14F3D69A1C50B3E84F17DA810C29E4",
        verdictLabel: task.status === "APPROVED" ? "准予通过" : "退回补正",
        callbackTicket: `ACK-OA-20260905-${task.id.replace("REQ-", "")}`,
        sourceSystem: task.sourceSystem
      });
      setHumanReviewNote(task.humanReviewNote || "");
    } else {
      setSignedCertificate(null);
    }

    setGlobalNav("DETAIL_VIEW");
    executeAnalysis(newForm, newAtts);
  };

  // 模拟外部系统新推送数据
  const handleSimulateNewPush = () => {
    const randomCase = MOCK_CASES[Math.floor(Math.random() * MOCK_CASES.length)];
    const newId = `REQ-202609-${String(tasks.length + 1).padStart(3, "0")}`;
    const newTask: PushTaskItem = {
      ...randomCase.taskItem,
      id: newId,
      contractNo: `ZR-AUTO-${Date.now().toString().slice(-4)}`,
      pushedAt: new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" }),
      status: "PENDING_REVIEW"
    };
    setTasks([newTask, ...tasks]);
  };

  // 审批意见提交并反馈业务系统逻辑
  const handleZhaoSubmitApproval = () => {
    if (!humanReviewNote.trim()) {
      alert("请填写审批意见后再提交反馈！");
      return;
    }
    if (!ackCompliance) {
      alert("请确认履职责任承诺确认框！");
      return;
    }

    const timeStr = new Date().toLocaleString("zh-CN");
    const certNo = `CFCA-SOE-2026-${Date.now().toString().slice(-6)}`;
    const sm2Hash = `SM2_SIG_${Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join("").toUpperCase()}`;
    const verdictLabel = approvalVerdict === "APPROVED" ? "准予通过" : approvalVerdict === "REJECT" ? "坚决否决" : "退回补正";
    const callbackTicket = `ACK-OA-20260905-${Date.now().toString().slice(-6)}`;

    setSignedCertificate({
      signTime: timeStr,
      certNo,
      sm2Hash,
      verdictLabel,
      callbackTicket,
      sourceSystem: currentTask.sourceSystem
    });

    const newStatus = approvalVerdict === "APPROVED" ? "APPROVED" : "REJECTED";

    // 1. 同步待办池状态
    setTasks((prev) =>
      prev.map((t) =>
        t.id === currentTask.id
          ? {
              ...t,
              status: newStatus,
              humanReviewNote: humanReviewNote,
              humanSignOffAt: timeStr
            }
          : t
      )
    );

    // 2. 更新当前单据状态
    setCurrentTask((prev) => ({
      ...prev,
      status: newStatus,
      humanReviewNote: humanReviewNote,
      humanSignOffAt: timeStr
    }));
  };

  // 快捷批语引用
  const applyQuickNote = (type: "AI_SUGGESTION" | "AGREE" | "SUPPLEMENT" | "REJECT") => {
    if (type === "AI_SUGGESTION") {
      const gmOpinion = analysisResult?.roleOpinions.find((r) => r.roleId === "GENERAL_MANAGER")?.opinionText;
      if (gmOpinion) {
        setHumanReviewNote(gmOpinion);
      } else {
        setHumanReviewNote(`已复核 AI 审查意见：${analysisResult?.verdictSummary || "同意呈批"}`);
      }
    } else if (type === "AGREE") {
      setApprovalVerdict("APPROVED");
      setHumanReviewNote("【准予通过呈批】：经核验，合同全要素与送审附件一致，入围资质完备，无合规或资金风险。准予批准签署，请承办部门严格按约组织履约与质检。");
    } else if (type === "SUPPLEMENT") {
      setApprovalVerdict("REQUIRE_SUPPLEMENT");
      setHumanReviewNote("【退回补正材料】：经审查，呈批单申报金额与附件清单存在 5 万元勾稽差额，且未附党委会“三重一大”前置纪要文号，请经办人与财务处核实补齐后重新报审。");
    } else if (type === "REJECT") {
      setApprovalVerdict("REJECT");
      setHumanReviewNote("【坚决否决退回】：经审查，合同约定 95% 出厂合格率严重违背集团《食品质量合规规范》99.8% 底线且免除第三方 CMA 报告。坚决否决，请研发中心立即退回并启动备选供方评审。");
    }
  };

  // 上传新规章表单提交
  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocTitle.trim()) return;

    setUploadingStage("1/4 版面结构化识别中...");
    await new Promise((r) => setTimeout(r, 220));
    setUploadingStage("2/4 条款语义切片 (Semantic Chunking)...");
    await new Promise((r) => setTimeout(r, 220));
    setUploadingStage("3/4 提取合规约束红线索引...");
    await new Promise((r) => setTimeout(r, 220));
    setUploadingStage("4/4 写入本地向量知识库 (Vector DB)...");
    await new Promise((r) => setTimeout(r, 180));

    const categoryDef = CATEGORY_DEFINITIONS.find((c) => c.category === newDocCategory);
    const newDoc: KnowledgeDocument = {
      id: `DOC-CUSTOM-${Date.now().toString().slice(-4)}`,
      title: newDocTitle.startsWith("《") ? newDocTitle : `《${newDocTitle}》`,
      category: newDocCategory,
      categoryLabel: categoryDef?.label || "企业内部规章制度",
      docNo: newDocNo || "中润规审〔2026〕01号",
      version: newDocVersion || "v2026.1 现行版",
      status: "ACTIVE",
      publishDate: new Date().toISOString().split("T")[0],
      issuingBody: newDocIssuingBody || "集团风控合规部",
      fileSize: "2.4 MB",
      chunkCount: 28,
      clausesCount: 30,
      summary: newDocSummary || "新上传规章文件，涵盖核心业务流程与内控监督条款。",
      sampleClause: newDocClause || "第一条：本制度所列规范为强制性要求，相关审批流程必须严格对照执行。"
    };

    setKnowledgeDocs([newDoc, ...knowledgeDocs]);
    setUploadingStage("");
    setShowUploadModal(false);
    setNewDocTitle("");
    setNewDocNo("");
    setNewDocSummary("");
    setNewDocClause("");
  };

  const getRiskBadge = (risk: PushTaskItem["riskLevel"]) => {
    switch (risk) {
      case "HIGH_RISK":
        return <span className="status-badge status-badge-mismatch">致命违规拦截</span>;
      case "WARNING":
        return <span className="status-badge status-badge-warning">存在勾稽差额</span>;
      case "NORMAL":
      default:
        return <span className="status-badge status-badge-match">合规符合放行</span>;
    }
  };

  const filteredDocs = knowledgeDocs.filter((doc) => {
    const matchesCat = selectedCategory === "ALL" || doc.category === selectedCategory;
    const matchesKw =
      !searchKeyword.trim() ||
      doc.title.includes(searchKeyword) ||
      doc.docNo.includes(searchKeyword) ||
      doc.summary.includes(searchKeyword) ||
      doc.sampleClause.includes(searchKeyword);
    return matchesCat && matchesKw;
  });

  const filteredTasks = tasks.filter((t) => {
    if (taskRiskFilter !== "ALL" && t.riskLevel !== taskRiskFilter) return false;
    if (!taskSearchKeyword.trim()) return true;
    const kw = taskSearchKeyword.toLowerCase();
    return (
      t.id.toLowerCase().includes(kw) ||
      t.contractTitle.toLowerCase().includes(kw) ||
      t.contractNo.toLowerCase().includes(kw) ||
      t.department.toLowerCase().includes(kw) ||
      t.applicant.toLowerCase().includes(kw) ||
      t.supplierName.toLowerCase().includes(kw) ||
      t.sourceSystem.toLowerCase().includes(kw) ||
      t.alertSnippet.toLowerCase().includes(kw)
    );
  });

  const filteredLedgerTasks = tasks.filter((t) => {
    if (ledgerTab === "ARCHIVED" && t.status !== "APPROVED" && t.status !== "REJECTED") return false;
    if (!ledgerSearchKeyword.trim()) return true;
    const kw = ledgerSearchKeyword.toLowerCase();
    return (
      t.id.toLowerCase().includes(kw) ||
      t.contractTitle.toLowerCase().includes(kw) ||
      t.contractNo.toLowerCase().includes(kw) ||
      t.department.toLowerCase().includes(kw) ||
      t.applicant.toLowerCase().includes(kw) ||
      t.supplierName.toLowerCase().includes(kw) ||
      t.sourceSystem.toLowerCase().includes(kw) ||
      (t.humanReviewNote && t.humanReviewNote.toLowerCase().includes(kw))
    );
  });

  const pendingCount = tasks.filter((t) => t.status === "PENDING_REVIEW").length;
  const approvedCount = tasks.filter((t) => t.status === "APPROVED" || t.status === "REJECTED").length;

  return (
    <div className="app-layout">
      {/* ========================================================================= */}
      {/* 左侧菜单栏 (深色国企风 · 严谨业务分类 · 沉稳内敛)                       */}
      {/* ========================================================================= */}
      <aside className="sidebar">
        {/* 系统标志头 */}
        <div className="sidebar-brand">
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "4px",
              background: "#0284c7",
              color: "#ffffff",
              display: "grid",
              placeItems: "center",
              fontSize: "0.85rem",
              fontWeight: 700,
              flexShrink: 0
            }}
          >
            中
          </div>
          <div style={{ minWidth: 0, overflow: "hidden" }}>
            <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#ffffff", whiteSpace: "nowrap" }}>
              中润农垦集团
            </div>
            <div style={{ fontSize: "0.68rem", color: "#94a3b8" }}>
              合同合规审查平台
            </div>
          </div>
        </div>

        {/* 菜单分类导航 */}
        <nav className="sidebar-nav">
          
          {/* 分类一：合同审批业务流 */}
          <div className="sidebar-group-label">合同审批业务流</div>

          <button
            type="button"
            onClick={() => setGlobalNav("TASK_LIST")}
            className={`sidebar-nav-item ${globalNav === "TASK_LIST" || globalNav === "DETAIL_VIEW" ? "sidebar-nav-item-active" : ""}`}
          >
            <IconInbox />
            <span style={{ flex: 1 }}>待办审批</span>
            {pendingCount > 0 && (
              <span
                style={{
                  fontSize: "0.7rem",
                  padding: "1px 6px",
                  borderRadius: "10px",
                  background: globalNav === "TASK_LIST" || globalNav === "DETAIL_VIEW" ? "rgba(255,255,255,0.25)" : "#334155",
                  color: "#ffffff",
                  fontWeight: 600
                }}
              >
                {pendingCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setGlobalNav("AUDIT_LEDGER")}
            className={`sidebar-nav-item ${globalNav === "AUDIT_LEDGER" ? "sidebar-nav-item-active" : ""}`}
          >
            <IconLedger />
            <span style={{ flex: 1 }}>审批台账</span>
            {approvedCount > 0 && (
              <span style={{ fontSize: "0.68rem", color: "#64748b" }}>
                {approvedCount} 件
              </span>
            )}
          </button>

          {/* 分类二：内控合规资产 */}
          <div className="sidebar-group-label" style={{ marginTop: "8px" }}>内控合规资产</div>

          <button
            type="button"
            onClick={() => setGlobalNav("KNOWLEDGE_BASE")}
            className={`sidebar-nav-item ${globalNav === "KNOWLEDGE_BASE" ? "sidebar-nav-item-active" : ""}`}
          >
            <IconBook />
            <span style={{ flex: 1 }}>规章制度库</span>
            <span style={{ fontSize: "0.68rem", color: "#64748b" }}>
              {knowledgeDocs.length} 部
            </span>
          </button>

        </nav>

        {/* 底部当前登录人身份卡（严格固定为分管副总经理 赵志远） */}
        <div className="sidebar-footer">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "#0284c7",
                color: "#ffffff",
                display: "grid",
                placeItems: "center",
                fontSize: "0.8rem",
                fontWeight: 700,
                flexShrink: 0
              }}
            >
              赵
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: "0.84rem", color: "#ffffff", fontWeight: 700 }}>
                赵志远
              </div>
              <div style={{ fontSize: "0.68rem", color: "#94a3b8", whiteSpace: "nowrap" }}>
                分管副总经理 · 第一食品厂
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* 右侧主体工作区 (Main Content)                                            */}
      {/* ========================================================================= */}
      <main className="main-content">
        
        {/* 顶部固定导航条 (Pinned Topbar) */}
        <header className="main-topbar">
          {/* 左侧：面包屑与返回按钮 */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.84rem", color: "#64748b" }}>
            {globalNav === "DETAIL_VIEW" && (
              <button
                type="button"
                onClick={() => setGlobalNav("TASK_LIST")}
                className="btn-secondary"
                style={{ padding: "4px 10px", fontSize: "0.76rem", marginRight: "6px", display: "flex", alignItems: "center", gap: "4px" }}
              >
                <span>←</span> 返回待办列表
              </button>
            )}
            <span style={{ cursor: "pointer" }} onClick={() => setGlobalNav("TASK_LIST")}>
              首页
            </span>
            <span>/</span>
            {globalNav === "TASK_LIST" && <span style={{ fontWeight: 600, color: "#0f172a" }}>待办审批任务池</span>}
            {globalNav === "DETAIL_VIEW" && (
              <>
                <span style={{ cursor: "pointer" }} onClick={() => setGlobalNav("TASK_LIST")}>
                  待办审批
                </span>
                <span>/</span>
                <span className="mono" style={{ fontWeight: 600, color: "#0284c7" }}>
                  {formData.id}
                </span>
                <span style={{ color: "#0f172a", fontWeight: 600, maxWidth: "340px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  《{formData.contractTitle}》
                </span>
              </>
            )}
            {globalNav === "KNOWLEDGE_BASE" && <span style={{ fontWeight: 600, color: "#0f172a" }}>规章制度知识库</span>}
            {globalNav === "AUDIT_LEDGER" && <span style={{ fontWeight: 600, color: "#0f172a" }}>已办与签批台账</span>}
          </div>

          {/* 右侧：操作区 */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {globalNav === "DETAIL_VIEW" && (
              <>
                <button
                  type="button"
                  onClick={() => setShowDocModal(true)}
                  className="glow-btn"
                  style={{ padding: "5px 12px", fontSize: "0.8rem" }}
                >
                  导出合规审查意见书
                </button>
                <button
                  type="button"
                  onClick={() => executeAnalysis(formData, attachments)}
                  className="btn-secondary"
                  style={{ padding: "5px 10px", fontSize: "0.8rem" }}
                >
                  {loading ? "审查分析中..." : "重新智能审查"}
                </button>
              </>
            )}

            {globalNav === "TASK_LIST" && (
              <button
                type="button"
                onClick={handleSimulateNewPush}
                className="btn-secondary"
                style={{ padding: "5px 12px", fontSize: "0.8rem" }}
              >
                + 接收外部协同系统新推送
              </button>
            )}

            {globalNav === "KNOWLEDGE_BASE" && (
              <button
                type="button"
                onClick={() => setShowUploadModal(true)}
                className="glow-btn"
                style={{ padding: "5px 12px", fontSize: "0.8rem" }}
              >
                + 上传规章文件入库
              </button>
            )}
          </div>
        </header>

        {/* 独立可滚动内容视口容器 */}
        <div className="main-scroll-body">
          
          {/* ======================================================================= */}
          {/* 视图一：待办审批列表池 (TASK_LIST) */}
          {/* ======================================================================= */}
          {globalNav === "TASK_LIST" && (
            <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              
              <div className="glass-panel" style={{ padding: "18px 20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <div>
                    <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "#0f172a" }}>
                      协同系统推送单据待办审批池（分管副总经理 · 赵志远）
                    </h2>
                    <p style={{ fontSize: "0.76rem", color: "#64748b", marginTop: "2px" }}>
                      实时直连集团 OA 办公、ERP 供应链与 SAP 物资主数据系统；AI 自动化完成静默预审与勾稽核对
                    </p>
                  </div>

                  <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                    {/* 风险快速筛选标签 */}
                    <div style={{ display: "flex", gap: "4px", alignItems: "center", background: "#f1f5f9", padding: "3px", borderRadius: "6px", border: "1px solid #e2e8f0" }}>
                      <button
                        type="button"
                        onClick={() => setTaskRiskFilter("ALL")}
                        style={{
                          padding: "2px 8px",
                          borderRadius: "4px",
                          fontSize: "0.72rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          border: "none",
                          background: taskRiskFilter === "ALL" ? "#0284c7" : "transparent",
                          color: taskRiskFilter === "ALL" ? "#ffffff" : "#475569"
                        }}
                      >
                        全部 ({tasks.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setTaskRiskFilter("HIGH_RISK")}
                        style={{
                          padding: "2px 8px",
                          borderRadius: "4px",
                          fontSize: "0.72rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          border: "none",
                          background: taskRiskFilter === "HIGH_RISK" ? "#dc2626" : "transparent",
                          color: taskRiskFilter === "HIGH_RISK" ? "#ffffff" : "#dc2626"
                        }}
                      >
                        ⚠️ 高风险 ({tasks.filter(t => t.riskLevel === "HIGH_RISK").length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setTaskRiskFilter("WARNING")}
                        style={{
                          padding: "2px 8px",
                          borderRadius: "4px",
                          fontSize: "0.72rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          border: "none",
                          background: taskRiskFilter === "WARNING" ? "#d97706" : "transparent",
                          color: taskRiskFilter === "WARNING" ? "#ffffff" : "#d97706"
                        }}
                      >
                        ⚡️ 待补正 ({tasks.filter(t => t.riskLevel === "WARNING").length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setTaskRiskFilter("NORMAL")}
                        style={{
                          padding: "2px 8px",
                          borderRadius: "4px",
                          fontSize: "0.72rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          border: "none",
                          background: taskRiskFilter === "NORMAL" ? "#059669" : "transparent",
                          color: taskRiskFilter === "NORMAL" ? "#ffffff" : "#059669"
                        }}
                      >
                        ✓ 合规 ({tasks.filter(t => t.riskLevel === "NORMAL").length})
                      </button>
                    </div>

                    <input
                      type="text"
                      placeholder="搜索单号、合同、部门..."
                      className="fde-input"
                      style={{ width: "190px", height: "30px", fontSize: "0.78rem" }}
                      value={taskSearchKeyword}
                      onChange={(e) => setTaskSearchKeyword(e.target.value)}
                    />
                    <span style={{ fontSize: "0.74rem", color: "#475569", whiteSpace: "nowrap" }}>
                      待初审：<strong style={{ color: "#d97706" }}>{pendingCount}</strong> · 已反馈：<strong style={{ color: "#059669" }}>{approvedCount}</strong>
                    </span>
                  </div>
                </div>

                <table className="enterprise-table">
                  <thead>
                    <tr>
                      <th style={{ width: "130px", whiteSpace: "nowrap" }}>呈批单号</th>
                      <th>合同呈批事项</th>
                      <th>申报部门 / 经办人</th>
                      <th>相对方签约供应商</th>
                      <th style={{ whiteSpace: "nowrap" }}>呈批申报金额</th>
                      <th style={{ whiteSpace: "nowrap" }}>来源系统</th>
                      <th>AI 初审预警诊断</th>
                      <th style={{ width: "85px", minWidth: "85px", whiteSpace: "nowrap" }}>流转状态</th>
                      <th style={{ textAlign: "right", width: "100px", whiteSpace: "nowrap" }}>业务办理</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTasks.length === 0 ? (
                      <tr>
                        <td colSpan={9} style={{ textAlign: "center", padding: "30px", color: "#94a3b8", fontSize: "0.85rem" }}>
                          未检索到符合条件的待办单据
                        </td>
                      </tr>
                    ) : (
                      filteredTasks.map((task) => (
                        <tr key={task.id}>
                          <td className="mono" style={{ fontWeight: 600, color: "#0284c7", whiteSpace: "nowrap" }}>
                            {task.id}
                          </td>
                          <td>
                            <div style={{ fontWeight: 600, color: "#0f172a" }}>{task.contractTitle}</div>
                            <div className="mono" style={{ fontSize: "0.72rem", color: "#64748b" }}>
                              文号: {task.contractNo} · 接收: {task.pushedAt}
                            </div>
                          </td>
                          <td>
                            <div style={{ color: "#334155" }}>{task.department}</div>
                            <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{task.applicant}</div>
                          </td>
                          <td style={{ color: "#334155" }}>{task.supplierName}</td>
                          <td className="mono" style={{ fontWeight: 700, color: task.totalAmount >= 1000000 ? "#b45309" : "#0f172a", whiteSpace: "nowrap" }}>
                            ¥{task.totalAmount.toLocaleString()}
                          </td>
                          <td style={{ whiteSpace: "nowrap" }}>
                            <span style={{ fontSize: "0.72rem", background: "#f1f5f9", padding: "2px 6px", borderRadius: "4px", color: "#475569" }}>
                              {task.sourceSystem}
                            </span>
                          </td>
                          <td>
                            <div style={{ marginBottom: "2px" }}>{getRiskBadge(task.riskLevel)}</div>
                            <div style={{ fontSize: "0.74rem", color: "#64748b", maxWidth: "260px" }}>
                              {task.alertSnippet}
                            </div>
                          </td>
                          <td style={{ whiteSpace: "nowrap" }}>
                            {task.status === "PENDING_REVIEW" && (
                              <span style={{ fontSize: "0.74rem", color: "#d97706", background: "#fffbeb", padding: "2px 6px", borderRadius: "4px", fontWeight: 600, whiteSpace: "nowrap" }}>
                                待审中
                              </span>
                            )}
                            {task.status === "APPROVED" && (
                              <span style={{ fontSize: "0.74rem", color: "#059669", background: "#ecfdf5", padding: "2px 6px", borderRadius: "4px", fontWeight: 600, whiteSpace: "nowrap" }}>
                                准予通过
                              </span>
                            )}
                            {task.status === "REJECTED" && (
                              <span style={{ fontSize: "0.74rem", color: "#dc2626", background: "#fef2f2", padding: "2px 6px", borderRadius: "4px", fontWeight: 600, whiteSpace: "nowrap" }}>
                                退回/否决
                              </span>
                            )}
                          </td>
                          <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                            <button
                              type="button"
                              onClick={() => handleOpenTask(task)}
                              className="glow-btn"
                              style={{ padding: "4px 12px", fontSize: "0.78rem" }}
                            >
                              办理审查 →
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* ======================================================================= */}
          {/* 视图二：业务详情页 (DETAIL_VIEW)                                         */}
          {/* 包含双页签：1. 合同合规审查 (来源单据、智能审查分析、审批意见反馈)；2. 审计推演日志 (时序节点树) */}
          {/* ======================================================================= */}
          {globalNav === "DETAIL_VIEW" && (
            <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "16px", paddingBottom: "80px" }}>
              
              {/* 详情页顶层双页签导航 */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#f1f5f9", padding: "6px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                <div style={{ display: "flex", gap: "6px" }}>
                  <button
                    type="button"
                    onClick={() => setDetailTab("REVIEW")}
                    className={`detail-tab ${detailTab === "REVIEW" ? "detail-tab-active" : ""}`}
                  >
                    <span>📄</span> 合同合规审查
                  </button>

                  <button
                    type="button"
                    onClick={() => setDetailTab("AUDIT_LOG")}
                    className={`detail-tab ${detailTab === "AUDIT_LOG" ? "detail-tab-active" : ""}`}
                  >
                    <span>🔍</span> 审计推演日志
                  </button>
                </div>

                <div style={{ fontSize: "0.78rem", color: "#64748b", paddingRight: "10px", display: "flex", alignItems: "center", gap: "12px" }}>
                  <span>来源系统：<strong style={{ color: "#0f172a" }}>{currentTask.sourceSystem}</strong></span>
                  <span>·</span>
                  <span>单据文号：<strong className="mono" style={{ color: "#0284c7" }}>{formData.id}</strong></span>
                </div>
              </div>

              {/* ------------------------------------------------------------------- */}
              {/* 页签一：合同合规审查                                                */}
              {/* 1. 业务来源单据 (字段与附件)                                       */}
              {/* 2. 智能审查分析 (提取分析、勾稽比对与依据结论)                       */}
              {/* 3. 审批意见反馈 (审批人意见与反馈业务系统)                          */}
              {/* ------------------------------------------------------------------- */}
              {detailTab === "REVIEW" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>

                  {/* --------------------------------------------------------------- */}
                  {/* 1. 业务来源单据                                                  */}
                  {/* --------------------------------------------------------------- */}
                  <section className="glass-panel" style={{ padding: "18px 22px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", paddingBottom: "10px", borderBottom: "1px solid #f1f5f9" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <h2 style={{ fontSize: "0.98rem", fontWeight: 700, color: "#0f172a", margin: 0, display: "flex", alignItems: "center", gap: "6px" }}>
                          <span>📋</span> 业务来源单据
                        </h2>
                        <span style={{ fontSize: "0.72rem", background: "#f1f5f9", color: "#475569", padding: "2px 8px", borderRadius: "4px", fontWeight: 600 }}>
                          审查要素提炼
                        </span>
                      </div>
                      <div style={{ display: "flex", gap: "12px", fontSize: "0.75rem", color: "#64748b", alignItems: "center" }}>
                        <span>来源系统：<strong style={{ color: "#0284c7" }}>{currentTask.sourceSystem}</strong></span>
                        <span>·</span>
                        <span>单据编号：<strong className="mono" style={{ color: "#334155" }}>{formData.id}</strong></span>
                        <span>·</span>
                        <span>推送时间：<strong className="mono" style={{ color: "#334155" }}>{currentTask.pushedAt}</strong></span>
                        <span>·</span>
                        <span>呈批部门：<strong style={{ color: "#334155" }}>{formData.department}</strong>（{formData.applicant}）</span>
                      </div>
                    </div>

                    {/* 精炼审查字段网格 (3列紧凑高密度布局) */}
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)",
                      gap: "1px",
                      background: "#e2e8f0",
                      border: "1px solid #e2e8f0",
                      borderRadius: "6px",
                      overflow: "hidden",
                      marginBottom: "12px"
                    }}>
                      {/* 1. 合同标的与系统文号 */}
                      <div style={{ background: "#ffffff", padding: "10px 14px" }}>
                        <div style={{ fontSize: "0.72rem", color: "#64748b", marginBottom: "3px" }}>合同名称及系统文号</div>
                        <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#0f172a", lineHeight: 1.3 }}>
                          《{formData.contractTitle}》
                        </div>
                        <div className="mono" style={{ fontSize: "0.72rem", color: "#0284c7", marginTop: "2px" }}>
                          {formData.contractNo} · <span style={{ color: "#64748b" }}>{formData.contractType}</span>
                        </div>
                      </div>

                      {/* 2. 呈批申报总额 */}
                      <div style={{ background: "#ffffff", padding: "10px 14px" }}>
                        <div style={{ fontSize: "0.72rem", color: "#64748b", marginBottom: "3px" }}>呈批申报总额</div>
                        <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
                          <span className="mono" style={{ fontSize: "1.02rem", fontWeight: 700, color: formData.totalAmount >= 1000000 ? "#b45309" : "#0f172a" }}>
                            ¥{formData.totalAmount.toLocaleString()} 元
                          </span>
                          {formData.totalAmount >= 1000000 && (
                            <span style={{ fontSize: "0.68rem", background: "#fef3c7", color: "#b45309", padding: "1px 6px", borderRadius: "3px", fontWeight: 700 }}>
                              大额资金(≥100万)
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: "0.72rem", color: "#64748b", marginTop: "2px" }}>
                          {formData.totalAmountChinese}
                        </div>
                      </div>

                      {/* 3. 签约双方主体资质 */}
                      <div style={{ background: "#ffffff", padding: "10px 14px" }}>
                        <div style={{ fontSize: "0.72rem", color: "#64748b", marginBottom: "3px" }}>签约双方主体</div>
                        <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          <span style={{ color: "#64748b", fontSize: "0.72rem" }}>甲方：</span>{formData.partyA}
                        </div>
                        <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "#0284c7", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginTop: "2px" }}>
                          <span style={{ color: "#64748b", fontSize: "0.72rem" }}>乙方：</span>{formData.supplierName}
                          <span style={{ fontSize: "0.68rem", background: "#f1f5f9", color: "#475569", padding: "1px 5px", borderRadius: "3px", marginLeft: "6px", fontWeight: "normal" }}>
                            资信 {formData.supplierCredit.creditRating}
                          </span>
                        </div>
                      </div>

                      {/* 4. 款项支付比例约定 */}
                      <div style={{ background: "#ffffff", padding: "10px 14px" }}>
                        <div style={{ fontSize: "0.72rem", color: "#64748b", marginBottom: "3px" }}>款项支付比例约定</div>
                        <div className="mono" style={{ fontSize: "0.82rem", fontWeight: 600, color: "#0f172a" }}>
                          预付 <span style={{ color: formData.prepaymentRatio > 30 ? "#dc2626" : "#059669" }}>{formData.prepaymentRatio}%</span> / 进度款 {formData.progressPaymentRatio}% / 质保金 {formData.warrantyRatio}%
                        </div>
                        <div style={{ fontSize: "0.72rem", color: formData.prepaymentRatio > 30 ? "#dc2626" : "#64748b", marginTop: "2px" }}>
                          {formData.prepaymentRatio > 30 ? "⚠️ 预付款超30%红线，需重点核验履约担保" : "符合国企预付款≤30%风控标准"}
                        </div>
                      </div>

                      {/* 5. 发票类型与增值税率 */}
                      <div style={{ background: "#ffffff", padding: "10px 14px" }}>
                        <div style={{ fontSize: "0.72rem", color: "#64748b", marginBottom: "3px" }}>发票类型与增值税率</div>
                        <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "#0f172a" }}>
                          {formData.taxRate}
                        </div>
                        <div style={{ fontSize: "0.72rem", color: "#64748b", marginTop: "2px" }}>
                          用于发票合规与税目交叉核验
                        </div>
                      </div>

                      {/* 6. 财务预算指标编号 */}
                      <div style={{ background: "#ffffff", padding: "10px 14px" }}>
                        <div style={{ fontSize: "0.72rem", color: "#64748b", marginBottom: "3px" }}>财务预算指标编号</div>
                        <div className="mono" style={{ fontSize: "0.82rem", fontWeight: 700, color: "#0284c7" }}>
                          {formData.budgetCode}
                        </div>
                        <div style={{ fontSize: "0.72rem", color: "#64748b", marginTop: "2px" }}>
                          归属年度科目：{formData.budgetSubject}
                        </div>
                      </div>

                      {/* 7. 质量与验收标准 */}
                      <div style={{ background: "#ffffff", padding: "10px 14px" }}>
                        <div style={{ fontSize: "0.72rem", color: "#64748b", marginBottom: "3px" }}>质量技术与验收标准</div>
                        <div style={{ fontSize: "0.82rem", fontWeight: 600, color: formData.qualityStandard.includes("95%") ? "#dc2626" : "#0f172a" }}>
                          {formData.qualityStandard}
                        </div>
                        <div style={{ fontSize: "0.72rem", color: formData.qualityStandard.includes("95%") ? "#dc2626" : "#64748b", marginTop: "2px" }}>
                          {formData.qualityStandard.includes("95%") ? "⚠️ 抽检合格率95%可能存在放宽合规隐患" : "执行既定国家质量抽检标准"}
                        </div>
                      </div>

                      {/* 8. 约定争议解决管辖 */}
                      <div style={{ background: "#ffffff", padding: "10px 14px" }}>
                        <div style={{ fontSize: "0.72rem", color: "#64748b", marginBottom: "3px" }}>约定争议解决管辖</div>
                        <div style={{ fontSize: "0.82rem", fontWeight: 600, color: "#0f172a" }}>
                          {formData.disputeJurisdiction}
                        </div>
                        <div style={{ fontSize: "0.72rem", color: "#64748b", marginTop: "2px" }}>
                          法务排他性管辖条款审查
                        </div>
                      </div>

                      {/* 9. “三重一大”前置审议纪要文号 */}
                      <div style={{ background: "#ffffff", padding: "10px 14px" }}>
                        <div style={{ fontSize: "0.72rem", color: "#64748b", marginBottom: "3px" }}>“三重一大”前置审议纪要</div>
                        <div style={{ fontSize: "0.82rem", fontWeight: 700, color: formData.hasMajorPartyResolution ? "#059669" : "#dc2626" }}>
                          {formData.hasMajorPartyResolution ? (
                            <span>✓ {formData.majorPartyResolutionNo}</span>
                          ) : (
                            <span>⚠️ 缺失党委会前置决议文号</span>
                          )}
                        </div>
                        <div style={{ fontSize: "0.72rem", color: "#64748b", marginTop: "2px" }}>
                          {formData.hasMajorPartyResolution ? "已完成集体决策前置审议程序" : "属于重大事项但未提供纪要凭证"}
                        </div>
                      </div>

                      {/* 10. 约定履约交付周期 */}
                      <div style={{ background: "#ffffff", padding: "10px 14px", gridColumn: "span 3" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div>
                            <span style={{ fontSize: "0.72rem", color: "#64748b", marginRight: "8px" }}>约定履约交付周期：</span>
                            <span className="mono" style={{ fontSize: "0.82rem", fontWeight: 600, color: "#0f172a" }}>
                              {formData.deliveryStartDate} 至 {formData.deliveryEndDate}
                            </span>
                            <span style={{ fontSize: "0.72rem", color: "#64748b", marginLeft: "14px" }}>
                              （交付地点：{formData.deliveryLocation}）
                            </span>
                          </div>
                          <div style={{ fontSize: "0.72rem", color: "#0284c7" }}>
                            已关联交期履约保证金监管
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 送审附件清单 (精简条状展示) */}
                    <div style={{ background: "#f8fafc", padding: "8px 14px", borderRadius: "6px", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ fontSize: "0.74rem", fontWeight: 700, color: "#475569" }}>
                          送审随附原件 ({attachments.length} 份)：
                        </span>
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                          {attachments.map((att) => (
                            <button
                              key={att.id}
                              type="button"
                              onClick={() => setViewingAttachment(att)}
                              title="点击穿透查验随附原件 OCR 结构化文本解析"
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                padding: "3px 8px",
                                background: "#ffffff",
                                border: "1px solid #0284c7",
                                borderRadius: "4px",
                                fontSize: "0.74rem",
                                cursor: "pointer",
                                boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
                              }}
                            >
                              <span style={{ fontWeight: 600, color: "#0f172a" }}>📄 {att.name}</span>
                              <span style={{ color: "#64748b", fontSize: "0.68rem" }}>({att.size})</span>
                              <span style={{ color: "#059669", fontSize: "0.68rem", fontWeight: 600 }}>✓ OCR解析完成</span>
                              <span style={{ fontSize: "0.66rem", color: "#0284c7", background: "#f0f9ff", padding: "1px 5px", borderRadius: "3px", fontWeight: 600 }}>
                                穿透查验原件 ➔
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                      <div style={{ fontSize: "0.72rem", color: "#64748b" }}>
                        附件要素已由系统自动解析提取，并与上述单据字段完成智能勾稽
                      </div>
                    </div>

                  </section>

                  {/* --------------------------------------------------------------- */}
                  {/* 2. 智能审查分析                                                  */}
                  {/* --------------------------------------------------------------- */}
                  <section className="glass-panel" style={{ padding: "20px 24px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", paddingBottom: "10px", borderBottom: "1px solid #f1f5f9" }}>
                      <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "#0f172a" }}>
                        智能审查分析
                      </h2>
                      <button
                        type="button"
                        onClick={() => setDetailTab("AUDIT_LOG")}
                        className="btn-secondary"
                        style={{ padding: "4px 12px", fontSize: "0.76rem", color: "#0284c7" }}
                      >
                        查阅审计推演时序日志 →
                      </button>
                    </div>

                    {/* 审查结论与预警 Banner */}
                    {analysisResult && (
                      <div
                        style={{
                          padding: "14px 18px",
                          borderRadius: "6px",
                          marginBottom: "16px",
                          borderLeft: `4px solid ${analysisResult.overallVerdict === "HIGH_RISK_WARNING" ? "#dc2626" : analysisResult.overallVerdict === "REQUIRE_SUPPLEMENT" ? "#d97706" : "#059669"}`,
                          background: analysisResult.overallVerdict === "HIGH_RISK_WARNING" ? "#fef2f2" : analysisResult.overallVerdict === "REQUIRE_SUPPLEMENT" ? "#fffbeb" : "#ecfdf5"
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                          <div>
                            <h3 style={{
                              fontSize: "0.95rem",
                              fontWeight: 700,
                              color: analysisResult.overallVerdict === "HIGH_RISK_WARNING" ? "#b91c1c" : analysisResult.overallVerdict === "REQUIRE_SUPPLEMENT" ? "#b45309" : "#047857"
                            }}>
                              审查结论：{analysisResult.verdictTitle}
                            </h3>
                            <p style={{ color: "#334155", fontSize: "0.82rem", marginTop: "4px", lineHeight: 1.6 }}>
                              {analysisResult.verdictSummary}
                            </p>
                            <button
                              type="button"
                              onClick={() => {
                                applyQuickNote("AI_SUGGESTION");
                                const el = document.getElementById("approval-feedback-section");
                                if (el) el.scrollIntoView({ behavior: "smooth" });
                              }}
                              className="glow-btn"
                              style={{ marginTop: "8px", padding: "3px 10px", fontSize: "0.74rem", display: "inline-flex", alignItems: "center", gap: "6px" }}
                            >
                              <span>✓</span> 采纳AI结论并填入审批意见 ↓
                            </button>
                          </div>

                          <div style={{ display: "flex", gap: "12px", textAlign: "right", background: "#ffffff", padding: "6px 12px", borderRadius: "6px", border: "1px solid #e2e8f0" }}>
                            <div>
                              <div style={{ fontSize: "0.68rem", color: "#64748b" }}>审查耗时</div>
                              <div className="mono" style={{ fontSize: "0.84rem", fontWeight: 700, color: "#0f172a" }}>
                                {analysisResult.executionStats.durationMs}ms
                              </div>
                            </div>
                            <div>
                              <div style={{ fontSize: "0.68rem", color: "#64748b" }}>对标规章</div>
                              <div style={{ fontSize: "0.84rem", fontWeight: 700, color: "#0f172a" }}>
                                {analysisResult.executionStats.rulesChecked} 部
                              </div>
                            </div>
                            <div>
                              <div style={{ fontSize: "0.68rem", color: "#64748b" }}>置信度</div>
                              <div className="mono" style={{ fontSize: "0.84rem", fontWeight: 700, color: "#059669" }}>
                                {analysisResult.executionStats.confidenceScore}%
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 要素勾稽比对结果表 */}
                    {analysisResult && (
                      <div style={{ marginBottom: "16px" }}>
                        <div style={{ fontSize: "0.86rem", fontWeight: 700, color: "#0f172a", marginBottom: "8px" }}>
                          要素勾稽比对结果
                        </div>

                        <table className="enterprise-table">
                          <thead>
                            <tr>
                              <th style={{ width: "150px" }}>核验要素</th>
                              <th>单据申报值</th>
                              <th>附件抽取值</th>
                              <th style={{ width: "100px" }}>比对结论</th>
                              <th>差异分析</th>
                              <th style={{ width: "100px", textAlign: "right" }}>原件证据链</th>
                            </tr>
                          </thead>
                          <tbody>
                            {analysisResult.crossChecks.map((item, idx) => (
                              <tr key={idx} style={{ background: item.status === "MISMATCH" ? "#fef2f2" : item.status === "WARNING" ? "#fffbeb" : "transparent" }}>
                                <td style={{ fontWeight: 600, color: "#0f172a" }}>{item.fieldName}</td>
                                <td>{item.formValue}</td>
                                <td style={{ fontWeight: item.status === "MISMATCH" ? 700 : 400, color: item.status === "MISMATCH" ? "#dc2626" : "#334155" }}>
                                  {item.attachmentValue}
                                </td>
                                <td>
                                  {item.status === "MATCH" && <span className="status-badge status-badge-match">符合</span>}
                                  {item.status === "MISMATCH" && <span className="status-badge status-badge-mismatch">差额/不符</span>}
                                  {item.status === "WARNING" && <span className="status-badge status-badge-warning">要件缺失</span>}
                                </td>
                                <td style={{ fontSize: "0.78rem", color: "#64748b" }}>{item.detail}</td>
                                <td style={{ textAlign: "right" }}>
                                  <button
                                    type="button"
                                    onClick={() => setViewingEvidenceItem(item)}
                                    style={{
                                      fontSize: "0.72rem",
                                      padding: "2px 8px",
                                      background: "#ffffff",
                                      border: "1px solid #0284c7",
                                      borderRadius: "4px",
                                      color: "#0284c7",
                                      fontWeight: 600,
                                      cursor: "pointer"
                                    }}
                                  >
                                    🔍 条款溯源
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* 命中规章制度与标准依据 */}
                    {analysisResult && (
                      <div>
                        <div style={{ fontSize: "0.86rem", fontWeight: 700, color: "#0f172a", marginBottom: "8px" }}>
                          命中规章制度与标准依据
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          {analysisResult.citations.map((cite, i) => (
                            <div
                              key={i}
                              onClick={() => {
                                const matched = knowledgeDocs.find(d => d.title.includes(cite.ruleName.slice(0, 4)) || cite.ruleName.includes(d.title.slice(1, 5)));
                                setViewingRegulation({
                                  ruleName: cite.ruleName,
                                  clause: cite.clause,
                                  snippet: cite.snippet,
                                  applicability: cite.applicability,
                                  docNo: matched?.docNo || "中润规审〔2025〕08号",
                                  issuingBody: matched?.issuingBody || "集团风控与质量管理部"
                                });
                              }}
                              title="点击穿透查看官方规章条文全文与罚则释义"
                              style={{
                                background: "#f8fafc",
                                padding: "10px 14px",
                                borderRadius: "6px",
                                border: "1px solid #e2e8f0",
                                cursor: "pointer",
                                transition: "all 0.15s ease"
                              }}
                            >
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3px" }}>
                                <span style={{ fontWeight: 700, color: "#0f172a", fontSize: "0.84rem" }}>
                                  {cite.ruleName} · {cite.clause}
                                </span>
                                <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                                  <span style={{
                                    fontSize: "0.68rem",
                                    padding: "1px 5px",
                                    borderRadius: "3px",
                                    fontWeight: 600,
                                    background: cite.status === "VIOLATION" ? "#fef2f2" : "#ecfdf5",
                                    color: cite.status === "VIOLATION" ? "#dc2626" : "#059669"
                                  }}>
                                    {cite.status === "VIOLATION" ? "红线冲突" : "符合要求"}
                                  </span>
                                  <span style={{ fontSize: "0.68rem", color: "#0284c7" }}>查看制度释义 ➔</span>
                                </div>
                              </div>
                              <div style={{ fontSize: "0.78rem", color: "#475569", fontStyle: "italic", borderLeft: "3px solid #0284c7", paddingLeft: "8px", margin: "4px 0" }}>
                                “{cite.snippet}”
                              </div>
                              <div style={{ fontSize: "0.74rem", color: "#64748b" }}>
                                适用说明：{cite.applicability}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </section>

                  {/* --------------------------------------------------------------- */}
                  {/* 3. 审批意见反馈                                                  */}
                  {/* --------------------------------------------------------------- */}
                  <section id="approval-feedback-section" className="glass-panel" style={{ padding: "20px 24px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", paddingBottom: "10px", borderBottom: "1px solid #f1f5f9" }}>
                      <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "#0f172a" }}>
                        审批意见反馈
                      </h2>
                      <div style={{ fontSize: "0.78rem", color: "#64748b" }}>
                        审查人：<strong style={{ color: "#0f172a" }}>赵志远（分管副总经理）</strong>
                      </div>
                    </div>

                    {/* 审批决议单选 */}
                    <div style={{ marginBottom: "14px" }}>
                      <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "#334155", display: "block", marginBottom: "8px" }}>
                        审批决议：
                      </label>
                      <div style={{ display: "flex", gap: "10px" }}>
                        <label
                          style={{
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "8px 12px",
                            borderRadius: "6px",
                            border: `1.5px solid ${approvalVerdict === "APPROVED" ? "#059669" : "#cbd5e1"}`,
                            background: approvalVerdict === "APPROVED" ? "#ecfdf5" : "#ffffff",
                            cursor: "pointer"
                          }}
                        >
                          <input
                            type="radio"
                            name="zhaoVerdict"
                            checked={approvalVerdict === "APPROVED"}
                            onChange={() => {
                              setApprovalVerdict("APPROVED");
                              applyQuickNote("AGREE");
                            }}
                          />
                          <div>
                            <div style={{ fontSize: "0.84rem", fontWeight: 700, color: approvalVerdict === "APPROVED" ? "#047857" : "#0f172a" }}>
                              准予通过
                            </div>
                            <div style={{ fontSize: "0.68rem", color: "#64748b" }}>
                              要素核对无误，符合集团内控合规要求
                            </div>
                          </div>
                        </label>

                        <label
                          style={{
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "8px 12px",
                            borderRadius: "6px",
                            border: `1.5px solid ${approvalVerdict === "REQUIRE_SUPPLEMENT" ? "#d97706" : "#cbd5e1"}`,
                            background: approvalVerdict === "REQUIRE_SUPPLEMENT" ? "#fffbeb" : "#ffffff",
                            cursor: "pointer"
                          }}
                        >
                          <input
                            type="radio"
                            name="zhaoVerdict"
                            checked={approvalVerdict === "REQUIRE_SUPPLEMENT"}
                            onChange={() => {
                              setApprovalVerdict("REQUIRE_SUPPLEMENT");
                              applyQuickNote("SUPPLEMENT");
                            }}
                          />
                          <div>
                            <div style={{ fontSize: "0.84rem", fontWeight: 700, color: approvalVerdict === "REQUIRE_SUPPLEMENT" ? "#b45309" : "#0f172a" }}>
                              退回补正
                            </div>
                            <div style={{ fontSize: "0.68rem", color: "#64748b" }}>
                              存在勾稽差额或前置审议材料缺失
                            </div>
                          </div>
                        </label>

                        <label
                          style={{
                            flex: 1,
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            padding: "8px 12px",
                            borderRadius: "6px",
                            border: `1.5px solid ${approvalVerdict === "REJECT" ? "#dc2626" : "#cbd5e1"}`,
                            background: approvalVerdict === "REJECT" ? "#fef2f2" : "#ffffff",
                            cursor: "pointer"
                          }}
                        >
                          <input
                            type="radio"
                            name="zhaoVerdict"
                            checked={approvalVerdict === "REJECT"}
                            onChange={() => {
                              setApprovalVerdict("REJECT");
                              applyQuickNote("REJECT");
                            }}
                          />
                          <div>
                            <div style={{ fontSize: "0.84rem", fontWeight: 700, color: approvalVerdict === "REJECT" ? "#b91c1c" : "#0f172a" }}>
                              坚决否决
                            </div>
                            <div style={{ fontSize: "0.68rem", color: "#64748b" }}>
                              触碰食品安全质量底线或法律禁令
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* 审批意见文本与模板 */}
                    <div style={{ marginBottom: "6px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "#334155" }}>
                        审批意见：
                      </label>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button
                          type="button"
                          onClick={() => applyQuickNote("AI_SUGGESTION")}
                          className="btn-secondary"
                          style={{ padding: "2px 8px", fontSize: "0.72rem", color: "#0284c7" }}
                        >
                          引用系统建议
                        </button>
                        <button
                          type="button"
                          onClick={() => applyQuickNote("AGREE")}
                          className="btn-secondary"
                          style={{ padding: "2px 8px", fontSize: "0.72rem" }}
                        >
                          同意批复模板
                        </button>
                        <button
                          type="button"
                          onClick={() => applyQuickNote("SUPPLEMENT")}
                          className="btn-secondary"
                          style={{ padding: "2px 8px", fontSize: "0.72rem" }}
                        >
                          退回补正模板
                        </button>
                        <button
                          type="button"
                          onClick={() => applyQuickNote("REJECT")}
                          className="btn-secondary"
                          style={{ padding: "2px 8px", fontSize: "0.72rem" }}
                        >
                          否决退回模板
                        </button>
                      </div>
                    </div>

                    <textarea
                      rows={3}
                      className="fde-input"
                      value={humanReviewNote}
                      onChange={(e) => setHumanReviewNote(e.target.value)}
                      placeholder="请填写审批处理意见..."
                      style={{ marginBottom: "10px", fontSize: "0.82rem", lineHeight: 1.6 }}
                    />

                    {/* 责任承诺确认框 */}
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px", background: "#f8fafc", padding: "8px 12px", borderRadius: "4px", border: "1px solid #e2e8f0" }}>
                      <input
                        type="checkbox"
                        id="ackCheck"
                        checked={ackCompliance}
                        onChange={(e) => setAckCompliance(e.target.checked)}
                        style={{ cursor: "pointer" }}
                      />
                      <label htmlFor="ackCheck" style={{ fontSize: "0.74rem", color: "#334155", cursor: "pointer" }}>
                        本人已复核单据要素、随附附件及智能审查分析结论，知悉重大合同履职责任。
                      </label>
                    </div>

                    {/* 提交动作栏 */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ fontSize: "0.74rem", color: "#64748b" }}>
                        审批意见将通过 Webhook 接口实时反馈至业务系统（{currentTask.sourceSystem}）并归档留痕。
                      </div>

                      <button
                        type="button"
                        onClick={handleZhaoSubmitApproval}
                        className="glow-btn"
                        style={{ padding: "8px 20px", fontSize: "0.84rem", fontWeight: 700 }}
                      >
                        提交审批并反馈业务系统
                      </button>
                    </div>

                    {/* 反馈成功回执卡片 */}
                    {signedCertificate && (
                      <div
                        style={{
                          marginTop: "14px",
                          background: "#f0fdf4",
                          border: "1.5px dashed #059669",
                          borderRadius: "6px",
                          padding: "12px 16px",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center"
                        }}
                      >
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "#059669" }}>
                              ✓ 审批意见已成功反馈至业务系统
                            </span>
                            <span style={{ fontSize: "0.7rem", background: "#ecfdf5", color: "#059669", padding: "1px 6px", borderRadius: "3px", border: "1px solid #a7f3d0" }}>
                              决议：{signedCertificate.verdictLabel}
                            </span>
                          </div>
                          <div style={{ fontSize: "0.74rem", color: "#475569", marginTop: "4px" }}>
                            业务系统：<strong>{signedCertificate.sourceSystem}</strong> · 回执单号：<span className="mono">{signedCertificate.callbackTicket}</span>
                          </div>
                          <div style={{ fontSize: "0.74rem", color: "#475569", marginTop: "2px" }}>
                            审查人：<strong>赵志远（分管副总经理）</strong> · 反馈时间：{signedCertificate.signTime}
                          </div>
                          <div className="mono" style={{ fontSize: "0.68rem", color: "#64748b", marginTop: "2px" }}>
                            CA 证书序列号：{signedCertificate.certNo} · 国密哈希：{signedCertificate.sm2Hash.slice(0, 32)}...
                          </div>
                        </div>

                        {/* 电子印戳 */}
                        <div
                          style={{
                            border: "2px solid #dc2626",
                            color: "#dc2626",
                            borderRadius: "50%",
                            width: "72px",
                            height: "72px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            transform: "rotate(-12deg)",
                            opacity: 0.85,
                            userSelect: "none"
                          }}
                        >
                          <div style={{ fontSize: "0.52rem", fontWeight: 700 }}>中润农垦</div>
                          <div style={{ fontSize: "0.7rem", fontWeight: 800 }}>已签署</div>
                          <div style={{ fontSize: "0.48rem" }}>合同呈批专用</div>
                        </div>
                      </div>
                    )}

                  </section>

                </div>
              )}

              {/* ------------------------------------------------------------------- */}
              {/* 页签二：审计推演日志 (时序节点树 / Timeline Node Tree)              */}
              {/* ------------------------------------------------------------------- */}
              {detailTab === "AUDIT_LOG" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  
                  {/* 审计日志顶层指标与追踪信息 */}
                  <div className="glass-panel" style={{ padding: "18px 22px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <span style={{ fontSize: "1rem", fontWeight: 700, color: "#0f172a" }}>
                            合同智能审查审计推演日志 (Audit Timeline Trace)
                          </span>
                          <span style={{ fontSize: "0.7rem", background: "#f1f5f9", color: "#475569", padding: "1px 6px", borderRadius: "3px", fontWeight: 600 }}>
                            信创审计追踪
                          </span>
                        </div>
                        <div style={{ fontSize: "0.76rem", color: "#64748b", marginTop: "4px" }}>
                          流水任务号：<span className="mono" style={{ color: "#0284c7" }}>AUDIT-TRACE-{formData.id}</span> · 目标合同：{formData.contractNo} · 引擎版本：中润信创大模型审查引擎 v2.4
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setDetailTab("REVIEW")}
                        className="glow-btn"
                        style={{ padding: "5px 12px", fontSize: "0.78rem" }}
                      >
                        ← 返回合规审查
                      </button>
                    </div>

                    {/* 4 项量化指标卡片 */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px", marginTop: "14px" }}>
                      <div style={{ background: "#f8fafc", padding: "10px 14px", borderRadius: "6px", border: "1px solid #e2e8f0" }}>
                        <div style={{ fontSize: "0.7rem", color: "#64748b" }}>审查分析全流程耗时</div>
                        <div className="mono" style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0284c7", marginTop: "2px" }}>
                          {analysisResult?.executionStats.durationMs || 380} ms
                        </div>
                        <div style={{ fontSize: "0.66rem", color: "#94a3b8" }}>秒级完成24项深度要素碰撞</div>
                      </div>

                      <div style={{ background: "#f8fafc", padding: "10px 14px", borderRadius: "6px", border: "1px solid #e2e8f0" }}>
                        <div style={{ fontSize: "0.7rem", color: "#64748b" }}>对标现行规章制度</div>
                        <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0f172a", marginTop: "2px" }}>
                          {knowledgeDocs.length} 部
                        </div>
                        <div style={{ fontSize: "0.66rem", color: "#94a3b8" }}>制度库向量条文索引</div>
                      </div>

                      <div style={{ background: "#f8fafc", padding: "10px 14px", borderRadius: "6px", border: "1px solid #e2e8f0" }}>
                        <div style={{ fontSize: "0.7rem", color: "#64748b" }}>检出合规风险与瑕疵</div>
                        <div style={{ fontSize: "1.1rem", fontWeight: 700, color: analysisResult?.overallVerdict === "HIGH_RISK_WARNING" ? "#dc2626" : "#d97706", marginTop: "2px" }}>
                          {analysisResult?.citations.filter(c => c.status === "VIOLATION").length || 2} 项
                        </div>
                        <div style={{ fontSize: "0.66rem", color: "#94a3b8" }}>精准匹配具体法条罚则</div>
                      </div>

                      <div style={{ background: "#f8fafc", padding: "10px 14px", borderRadius: "6px", border: "1px solid #e2e8f0" }}>
                        <div style={{ fontSize: "0.7rem", color: "#64748b" }}>证据链置信度</div>
                        <div className="mono" style={{ fontSize: "1.1rem", fontWeight: 700, color: "#059669", marginTop: "2px" }}>
                          {analysisResult?.executionStats.confidenceScore || 98.8}%
                        </div>
                        <div style={{ fontSize: "0.66rem", color: "#94a3b8" }}>条文与事实源逐一印证</div>
                      </div>
                    </div>
                  </div>

                  {/* 时序节点树状态图例栏 */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 8px", fontSize: "0.74rem", color: "#64748b" }}>
                    <div>
                      时序推演节点树流水（共 6 个核心执行阶段）：
                    </div>
                    <div style={{ display: "flex", gap: "12px" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#059669" }}></span> 正常通过 (PASS)
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#d97706" }}></span> 检出异常 (WARN)
                      </span>
                      <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                        <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#94a3b8" }}></span> 待触发 (PENDING)
                      </span>
                    </div>
                  </div>

                  {/* 时序节点树结构 (Timeline Node Tree) */}
                  <div className="timeline-tree">

                    {/* 节点 1：单据报文接收与结构化要素解析 */}
                    <div className="tree-node">
                      <div className="tree-node-dot dot-pass">1</div>
                      <div className="tree-node-card">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{ fontWeight: 700, color: "#0f172a", fontSize: "0.88rem" }}>
                              1.0 业务来源单据接入与要素解析
                            </span>
                            <span style={{ fontSize: "0.68rem", color: "#64748b", background: "#f1f5f9", padding: "1px 6px", borderRadius: "3px" }}>
                              数据接入适配器 (OA Webhook Listener)
                            </span>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span className="mono" style={{ fontSize: "0.72rem", color: "#64748b" }}>2026-09-05 14:32:00.105</span>
                            <span style={{ fontSize: "0.7rem", color: "#059669", background: "#ecfdf5", padding: "1px 6px", borderRadius: "3px", fontWeight: 600 }}>
                              PASS · 32ms
                            </span>
                          </div>
                        </div>

                        {/* 子分支节点 */}
                        <div className="tree-sub-branch">
                          <div className="tree-sub-node">
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <span style={{ fontWeight: 600, color: "#334155" }}>1.1 业务系统报文解析 (Payload Validation)</span>
                              <span style={{ fontSize: "0.68rem", color: "#059669", fontWeight: 600 }}>PASS</span>
                            </div>
                            <div style={{ color: "#64748b", fontSize: "0.74rem", marginTop: "2px" }}>
                              接收到泛微 e-cology OA 推送事件，报文验签通过。单据文号：{formData.contractNo}，申请部门：{formData.department}。
                            </div>
                          </div>

                          <div className="tree-sub-node">
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <span style={{ fontWeight: 600, color: "#334155" }}>1.2 呈批要素提取与定级 (Schema Parsing)</span>
                              <span style={{ fontSize: "0.68rem", color: "#059669", fontWeight: 600 }}>PASS</span>
                            </div>
                            <div style={{ color: "#64748b", fontSize: "0.74rem", marginTop: "2px" }}>
                              抽取 24 项业务要素，识别申报金额 ¥{formData.totalAmount.toLocaleString()} 元。{formData.totalAmount >= 1000000 ? "突破 100 万元大额资金监管阈值，自动标记为重大资金合规初审。" : "常规资金级别。"}
                            </div>
                          </div>
                        </div>

                        {/* 结构化日志摘要 */}
                        <div style={{ marginTop: "10px", background: "#f8fafc", padding: "8px 12px", borderRadius: "4px", border: "1px solid #e2e8f0", fontSize: "0.72rem" }}>
                          <span style={{ color: "#64748b" }}>报文摘要：</span>
                          <span className="mono" style={{ color: "#334155" }}>
                            {`{ id: "${formData.id}", contractNo: "${formData.contractNo}", partyA: "${formData.partyA}", totalAmount: ${formData.totalAmount} }`}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 节点 2：随附原件文档解析与多模态实体抽取 */}
                    <div className="tree-node">
                      <div className="tree-node-dot dot-pass">2</div>
                      <div className="tree-node-card">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{ fontWeight: 700, color: "#0f172a", fontSize: "0.88rem" }}>
                              2.0 随附原件文档解析与多模态实体抽取
                            </span>
                            <span style={{ fontSize: "0.68rem", color: "#64748b", background: "#f1f5f9", padding: "1px 6px", borderRadius: "3px" }}>
                              多模态文档解析与 OCR 结构化引擎
                            </span>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span className="mono" style={{ fontSize: "0.72rem", color: "#64748b" }}>2026-09-05 14:32:00.137</span>
                            <span style={{ fontSize: "0.7rem", color: "#059669", background: "#ecfdf5", padding: "1px 6px", borderRadius: "3px", fontWeight: 600 }}>
                              PASS · 176ms
                            </span>
                          </div>
                        </div>

                        <div className="tree-sub-branch">
                          <div className="tree-sub-node">
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <span style={{ fontWeight: 600, color: "#334155" }}>2.1 原件文本层识别与版面切分 (Layout Parsing)</span>
                              <span style={{ fontSize: "0.68rem", color: "#059669", fontWeight: 600 }}>PASS</span>
                            </div>
                            <div style={{ color: "#64748b", fontSize: "0.74rem", marginTop: "2px" }}>
                              对随附文件《{attachments[0]?.name}》({attachments[0]?.size}) 进行 OCR 识别，抽取合同正文及供货明细表数据。
                            </div>
                          </div>

                          <div className="tree-sub-node">
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <span style={{ fontWeight: 600, color: "#334155" }}>2.2 商务标的与关键条款抽取 (NER Extraction)</span>
                              <span style={{ fontSize: "0.68rem", color: "#059669", fontWeight: 600 }}>PASS</span>
                            </div>
                            <div style={{ color: "#64748b", fontSize: "0.74rem", marginTop: "2px" }}>
                              结构化抽取供货清单单价乘积累计、专用发票税率条款、违约责任上限及争议解决机构条款。
                            </div>
                          </div>
                        </div>

                        <div style={{ marginTop: "10px", background: "#f8fafc", padding: "8px 12px", borderRadius: "4px", border: "1px solid #e2e8f0", fontSize: "0.72rem" }}>
                          <span style={{ color: "#64748b" }}>抽取实体：</span>
                          <span className="mono" style={{ color: "#334155" }}>
                            {`{ supplier: "${attachments[0]?.extractedFields.supplierName || formData.supplierName}", itemsSum: ${(attachments[0]?.extractedFields.contractAmount ?? formData.totalAmount).toLocaleString()} }`}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 节点 3：单据要素与原件内容双向交叉勾稽核验 */}
                    <div className="tree-node">
                      <div className={`tree-node-dot ${analysisResult?.crossChecks.some(c => c.status === "MISMATCH") ? "dot-warn" : "dot-pass"}`}>3</div>
                      <div className="tree-node-card">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{ fontWeight: 700, color: "#0f172a", fontSize: "0.88rem" }}>
                              3.0 单据要素与原件内容双向交叉勾稽核验
                            </span>
                            <span style={{ fontSize: "0.68rem", color: "#64748b", background: "#f1f5f9", padding: "1px 6px", borderRadius: "3px" }}>
                              要素交叉勾稽核验引擎 (Cross-Check Engine)
                            </span>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span className="mono" style={{ fontSize: "0.72rem", color: "#64748b" }}>2026-09-05 14:32:00.313</span>
                            <span style={{
                              fontSize: "0.7rem",
                              color: analysisResult?.crossChecks.some(c => c.status === "MISMATCH") ? "#d97706" : "#059669",
                              background: analysisResult?.crossChecks.some(c => c.status === "MISMATCH") ? "#fffbeb" : "#ecfdf5",
                              padding: "1px 6px",
                              borderRadius: "3px",
                              fontWeight: 600
                            }}>
                              {analysisResult?.crossChecks.some(c => c.status === "MISMATCH") ? "WARN · 68ms" : "PASS · 68ms"}
                            </span>
                          </div>
                        </div>

                        <div className="tree-sub-branch">
                          <div className="tree-sub-node">
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <span style={{ fontWeight: 600, color: "#334155" }}>3.1 商务金额勾稽碰撞 (Amount Consistency)</span>
                              <span style={{ fontSize: "0.68rem", color: formData.totalAmount !== (attachments[0]?.extractedFields.contractAmount ?? formData.totalAmount) ? "#dc2626" : "#059669", fontWeight: 600 }}>
                                {formData.totalAmount !== (attachments[0]?.extractedFields.contractAmount ?? formData.totalAmount) ? "MISMATCH" : "PASS"}
                              </span>
                            </div>
                            <div style={{ color: "#64748b", fontSize: "0.74rem", marginTop: "2px" }}>
                              单据申报 ¥{formData.totalAmount.toLocaleString()} 元 vs 附件清单明细累计 ¥{(attachments[0]?.extractedFields.contractAmount ?? formData.totalAmount).toLocaleString()} 元。
                              {formData.totalAmount !== (attachments[0]?.extractedFields.contractAmount ?? formData.totalAmount) ? (
                                <span style={{ color: "#dc2626", fontWeight: 600, marginLeft: "4px" }}>
                                  检出未列明差额 ¥{Math.abs(formData.totalAmount - (attachments[0]?.extractedFields.contractAmount ?? formData.totalAmount)).toLocaleString()} 元。
                                </span>
                              ) : (
                                <span style={{ color: "#059669", fontWeight: 600, marginLeft: "4px" }}>
                                  两处金额勾稽完全一致。
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="tree-sub-node">
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <span style={{ fontWeight: 600, color: "#334155" }}>3.2 专用发票税率条款核对 (Tax Rate Alignment)</span>
                              <span style={{ fontSize: "0.68rem", color: "#059669", fontWeight: 600 }}>PASS</span>
                            </div>
                            <div style={{ color: "#64748b", fontSize: "0.74rem", marginTop: "2px" }}>
                              申报发票类型与税率：{formData.taxRate}，已与附件约定专用条款进行比对。
                            </div>
                          </div>

                          <div className="tree-sub-node">
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <span style={{ fontWeight: 600, color: "#334155" }}>3.3 签约主体及管辖地核验 (Entity & Jurisdiction)</span>
                              <span style={{ fontSize: "0.68rem", color: "#059669", fontWeight: 600 }}>PASS</span>
                            </div>
                            <div style={{ color: "#64748b", fontSize: "0.74rem", marginTop: "2px" }}>
                              统一社会信用代码一致，约定管辖机构为：{formData.disputeJurisdiction}。
                            </div>
                          </div>
                        </div>

                        <div style={{ marginTop: "10px", background: "#f8fafc", padding: "8px 12px", borderRadius: "4px", border: "1px solid #e2e8f0", fontSize: "0.72rem" }}>
                          <span style={{ color: "#64748b" }}>勾稽诊断：</span>
                          <span style={{ color: "#334155" }}>
                            核对项总数：6 项，检出异常项：{analysisResult?.crossChecks.filter(c => c.status !== "MATCH").length || 1} 项。
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 节点 4：规章制度向量知识库检索与证据链对标 */}
                    <div className="tree-node">
                      <div className="tree-node-dot dot-pass">4</div>
                      <div className="tree-node-card">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{ fontWeight: 700, color: "#0f172a", fontSize: "0.88rem" }}>
                              4.0 规章制度向量知识库检索与证据链对标
                            </span>
                            <span style={{ fontSize: "0.68rem", color: "#64748b", background: "#f1f5f9", padding: "1px 6px", borderRadius: "3px" }}>
                              内控合规知识图谱与语义检索引擎 (RAG Engine)
                            </span>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span className="mono" style={{ fontSize: "0.72rem", color: "#64748b" }}>2026-09-05 14:32:00.381</span>
                            <span style={{ fontSize: "0.7rem", color: "#059669", background: "#ecfdf5", padding: "1px 6px", borderRadius: "3px", fontWeight: 600 }}>
                              PASS · 54ms
                            </span>
                          </div>
                        </div>

                        <div className="tree-sub-branch">
                          <div className="tree-sub-node">
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <span style={{ fontWeight: 600, color: "#334155" }}>4.1 现行规章知识库语义检索 (Vector Retrieval)</span>
                              <span style={{ fontSize: "0.68rem", color: "#059669", fontWeight: 600 }}>PASS</span>
                            </div>
                            <div style={{ color: "#64748b", fontSize: "0.74rem", marginTop: "2px" }}>
                              检索内部制度、技术规范与国家标准共 {knowledgeDocs.length} 部，Top-K 相似度召回。
                            </div>
                          </div>

                          <div className="tree-sub-node">
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <span style={{ fontWeight: 600, color: "#334155" }}>4.2 命中条文判定 (Grounding Citations)</span>
                              <span style={{ fontSize: "0.68rem", color: "#d97706", fontWeight: 600 }}>HIT (2项)</span>
                            </div>
                            <div style={{ color: "#64748b", fontSize: "0.74rem", marginTop: "2px" }}>
                              {analysisResult?.citations.length ? `命中 ${analysisResult.citations.length} 条监管条文：${analysisResult.citations.map(c => `《${c.ruleName}》${c.clause}`).join("、")}` : "未发现触碰规章制度红线条款。"}
                            </div>
                          </div>
                        </div>

                        <div style={{ marginTop: "10px", background: "#f8fafc", padding: "8px 12px", borderRadius: "4px", border: "1px solid #e2e8f0", fontSize: "0.72rem" }}>
                          <span style={{ color: "#64748b" }}>知识引用：</span>
                          <span className="mono" style={{ color: "#334155" }}>
                            {`{ matchedRules: ["中润规字〔2025〕08号", "GB-7718-2024"], topSimilarity: 0.942 }`}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 节点 5：综合合规审查研判与决策处置建议生成 */}
                    <div className="tree-node">
                      <div className="tree-node-dot dot-pass">5</div>
                      <div className="tree-node-card">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{ fontWeight: 700, color: "#0f172a", fontSize: "0.88rem" }}>
                              5.0 综合合规审查研判与处置建议生成
                            </span>
                            <span style={{ fontSize: "0.68rem", color: "#64748b", background: "#f1f5f9", padding: "1px 6px", borderRadius: "3px" }}>
                              合规智能研判决策大模型 (Compliance LLM)
                            </span>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span className="mono" style={{ fontSize: "0.72rem", color: "#64748b" }}>2026-09-05 14:32:00.435</span>
                            <span style={{ fontSize: "0.7rem", color: "#059669", background: "#ecfdf5", padding: "1px 6px", borderRadius: "3px", fontWeight: 600 }}>
                              PASS · 45ms
                            </span>
                          </div>
                        </div>

                        <div className="tree-sub-branch">
                          <div className="tree-sub-node">
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <span style={{ fontWeight: 600, color: "#334155" }}>5.1 风险定级与影响评估 (Risk Assessment)</span>
                              <span style={{ fontSize: "0.68rem", color: "#059669", fontWeight: 600 }}>PASS</span>
                            </div>
                            <div style={{ color: "#64748b", fontSize: "0.74rem", marginTop: "2px" }}>
                              综合研判结论：{analysisResult?.verdictTitle || "常规合规初审"}。建议处置：{analysisResult?.overallVerdict === "HIGH_RISK_WARNING" ? "【坚决否决/阻断】" : analysisResult?.overallVerdict === "REQUIRE_SUPPLEMENT" ? "【退回补正材料】" : "【准予通过呈批】"}。
                            </div>
                          </div>

                          <div className="tree-sub-node">
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <span style={{ fontWeight: 600, color: "#334155" }}>5.2 决策建议包组装 (Recommendation Assembly)</span>
                              <span style={{ fontSize: "0.68rem", color: "#059669", fontWeight: 600 }}>READY</span>
                            </div>
                            <div style={{ color: "#64748b", fontSize: "0.74rem", marginTop: "2px" }}>
                              组装审查意见、事实依据与修改建议，进入待审查签批状态。
                            </div>
                          </div>
                        </div>

                        <div style={{ marginTop: "10px", background: "#f8fafc", padding: "8px 12px", borderRadius: "4px", border: "1px solid #e2e8f0", fontSize: "0.72rem" }}>
                          <span style={{ color: "#64748b" }}>建议批语：</span>
                          <span style={{ color: "#334155" }}>
                            {humanReviewNote || analysisResult?.verdictSummary || "准予通过呈批"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 节点 6：审查意见反馈与业务系统状态同步 */}
                    <div className="tree-node">
                      <div className={`tree-node-dot ${signedCertificate ? "dot-pass" : "dot-pending"}`}>6</div>
                      <div className="tree-node-card">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span style={{ fontWeight: 700, color: "#0f172a", fontSize: "0.88rem" }}>
                              6.0 审查意见反馈与业务系统状态同步
                            </span>
                            <span style={{ fontSize: "0.68rem", color: "#64748b", background: "#f1f5f9", padding: "1px 6px", borderRadius: "3px" }}>
                              业务系统协同接口适配器 (OA/ERP Callback Adapter)
                            </span>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span className="mono" style={{ fontSize: "0.72rem", color: "#64748b" }}>
                              {signedCertificate ? signedCertificate.signTime : "等待审批人签批反馈..."}
                            </span>
                            <span style={{
                              fontSize: "0.7rem",
                              color: signedCertificate ? "#059669" : "#64748b",
                              background: signedCertificate ? "#ecfdf5" : "#f1f5f9",
                              padding: "1px 6px",
                              borderRadius: "3px",
                              fontWeight: 600
                            }}>
                              {signedCertificate ? "PASS · 24ms" : "PENDING"}
                            </span>
                          </div>
                        </div>

                        <div className="tree-sub-branch">
                          <div className="tree-sub-node">
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <span style={{ fontWeight: 600, color: "#334155" }}>6.1 审查人身份核验与 CA 验签 (Identity & Signature)</span>
                              <span style={{ fontSize: "0.68rem", color: signedCertificate ? "#059669" : "#64748b", fontWeight: 600 }}>
                                {signedCertificate ? "PASS" : "WAITING"}
                              </span>
                            </div>
                            <div style={{ color: "#64748b", fontSize: "0.74rem", marginTop: "2px" }}>
                              {signedCertificate
                                ? `审查人 赵志远（分管副总经理）签署完成，证书号：${signedCertificate.certNo}。`
                                : "等待分管副总经理完成审批签署。"}
                            </div>
                          </div>

                          <div className="tree-sub-node">
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <span style={{ fontWeight: 600, color: "#334155" }}>6.2 审批决议与意见回传业务系统 (Webhook Callback)</span>
                              <span style={{ fontSize: "0.68rem", color: signedCertificate ? "#059669" : "#64748b", fontWeight: 600 }}>
                                {signedCertificate ? "CALLBACK_OK" : "WAITING"}
                              </span>
                            </div>
                            <div style={{ color: "#64748b", fontSize: "0.74rem", marginTop: "2px" }}>
                              {signedCertificate
                                ? `通过 Webhook 回调 ${signedCertificate.sourceSystem} (HTTP 200 OK，回执号: ${signedCertificate.callbackTicket})，单据状态更新为【已反馈】。`
                                : "待提交后自动回调业务系统接口。"}
                            </div>
                          </div>

                          <div className="tree-sub-node">
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <span style={{ fontWeight: 600, color: "#334155" }}>6.3 审查结果台账固化与归档 (Ledger Persistence)</span>
                              <span style={{ fontSize: "0.68rem", color: signedCertificate ? "#059669" : "#64748b", fontWeight: 600 }}>
                                {signedCertificate ? "ARCHIVED" : "WAITING"}
                              </span>
                            </div>
                            <div style={{ color: "#64748b", fontSize: "0.74rem", marginTop: "2px" }}>
                              {signedCertificate
                                ? "审查记录、比对报告与电子签章写入不可篡改审批台账。"
                                : "待签批后自动归档同步。"}
                            </div>
                          </div>
                        </div>

                        <div style={{ marginTop: "10px", background: "#f8fafc", padding: "8px 12px", borderRadius: "4px", border: "1px solid #e2e8f0", fontSize: "0.72rem" }}>
                          <span style={{ color: "#64748b" }}>协同状态：</span>
                          <span style={{ color: "#334155" }}>
                            {signedCertificate
                              ? `已成功同步至 ${signedCertificate.sourceSystem}，完成单据协同闭环。`
                              : "等待审批人在【合同合规审查】界面完成签署并点击提交。"}
                          </span>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* 审计日志底层防篡改说明备忘卡 */}
                  <div className="glass-panel" style={{ padding: "14px 18px", background: "#f8fafc", fontSize: "0.74rem", color: "#64748b", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      中润农垦集团 AI 合规审查审计引擎 v2.4 (信创私有化版) · 审计日志序列号：<span className="mono" style={{ color: "#0284c7" }}>AUDIT-TRACE-{formData.id}</span>
                    </div>
                    <div>
                      审计时钟源：国家授时中心 NTP 时间戳固化 · 校验签名：SHA256-VERIFIED
                    </div>
                  </div>

                </div>
              )}

            </div>
          )}

          {/* ======================================================================= */}
          {/* 视图三：审批台账 (AUDIT_LEDGER) */}
          {/* ======================================================================= */}
          {globalNav === "AUDIT_LEDGER" && (
            <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              
              <div className="glass-panel" style={{ padding: "18px 20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", gap: "16px", flexWrap: "wrap" }}>
                  <div>
                    <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "#0f172a" }}>
                      国企合同签批审计与终身留痕台账 (Audit Ledger)
                    </h2>
                    <p style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "2px" }}>
                      根据国资委与内控审计要求，记录每一笔合同审批的时间戳、审批人身份、AI 辅助意见与最终采纳批注
                    </p>
                  </div>

                  <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                    <div style={{ display: "flex", gap: "4px", alignItems: "center", background: "#f1f5f9", padding: "3px", borderRadius: "6px", border: "1px solid #e2e8f0" }}>
                      <button
                        type="button"
                        onClick={() => setLedgerTab("ALL")}
                        style={{
                          padding: "3px 10px",
                          borderRadius: "4px",
                          fontSize: "0.72rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          border: "none",
                          background: ledgerTab === "ALL" ? "#0f172a" : "transparent",
                          color: ledgerTab === "ALL" ? "#ffffff" : "#475569"
                        }}
                      >
                        全量台账记录 ({tasks.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setLedgerTab("ARCHIVED")}
                        style={{
                          padding: "3px 10px",
                          borderRadius: "4px",
                          fontSize: "0.72rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          border: "none",
                          background: ledgerTab === "ARCHIVED" ? "#059669" : "transparent",
                          color: ledgerTab === "ARCHIVED" ? "#ffffff" : "#059669"
                        }}
                      >
                        ✓ 已签批结案存证 ({approvedCount})
                      </button>
                    </div>

                    <input
                      type="text"
                      placeholder="搜索单号、合同、相对方、意见..."
                      className="fde-input"
                      style={{ width: "200px", height: "30px", fontSize: "0.78rem" }}
                      value={ledgerSearchKeyword}
                      onChange={(e) => setLedgerSearchKeyword(e.target.value)}
                    />
                  </div>
                </div>

                <table className="enterprise-table">
                  <thead>
                    <tr>
                      <th style={{ width: "130px", whiteSpace: "nowrap" }}>呈批单号</th>
                      <th>合同编号与名称</th>
                      <th>申报部门 / 经办人</th>
                      <th>签约相对方</th>
                      <th style={{ whiteSpace: "nowrap" }}>合同金额</th>
                      <th style={{ whiteSpace: "nowrap" }}>签批责任人</th>
                      <th style={{ whiteSpace: "nowrap" }}>签批时间戳</th>
                      <th>最终签批结论与批注</th>
                      <th style={{ textAlign: "right", whiteSpace: "nowrap" }}>存证公文</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLedgerTasks.length === 0 ? (
                      <tr>
                        <td colSpan={9} style={{ textAlign: "center", padding: "30px", color: "#94a3b8", fontSize: "0.85rem" }}>
                          未检索到符合条件的台账记录
                        </td>
                      </tr>
                    ) : (
                      filteredLedgerTasks.map((task) => (
                        <tr key={task.id}>
                          <td className="mono" style={{ fontWeight: 600, color: "#0284c7", whiteSpace: "nowrap" }}>
                            {task.id}
                          </td>
                          <td>
                            <div style={{ fontWeight: 600, color: "#0f172a" }}>{task.contractTitle}</div>
                            <div className="mono" style={{ fontSize: "0.72rem", color: "#64748b" }}>{task.contractNo}</div>
                          </td>
                          <td>{task.department} · {task.applicant}</td>
                          <td>{task.supplierName}</td>
                          <td className="mono" style={{ fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap" }}>
                            ¥{task.totalAmount.toLocaleString()}
                          </td>
                          <td style={{ whiteSpace: "nowrap" }}>
                            <strong style={{ color: "#0f172a" }}>赵志远</strong>
                            <div style={{ fontSize: "0.7rem", color: "#64748b" }}>分管副总经理</div>
                          </td>
                          <td className="mono" style={{ fontSize: "0.76rem", color: "#334155", whiteSpace: "nowrap" }}>
                            {task.humanSignOffAt || task.pushedAt}
                          </td>
                          <td>
                            {task.status === "APPROVED" ? (
                              <span style={{ fontSize: "0.72rem", color: "#059669", background: "#ecfdf5", padding: "1px 6px", borderRadius: "3px", fontWeight: 600, whiteSpace: "nowrap" }}>
                                准予通过
                              </span>
                            ) : task.status === "REJECTED" ? (
                              <span style={{ fontSize: "0.72rem", color: "#dc2626", background: "#fef2f2", padding: "1px 6px", borderRadius: "3px", fontWeight: 600, whiteSpace: "nowrap" }}>
                                退回补正/否决
                              </span>
                            ) : (
                              <span style={{ fontSize: "0.72rem", color: "#d97706", background: "#fffbeb", padding: "1px 6px", borderRadius: "3px", whiteSpace: "nowrap" }}>
                                审查进行中
                              </span>
                            )}
                            <div style={{ fontSize: "0.74rem", color: "#64748b", marginTop: "2px" }}>
                              {task.humanReviewNote || "采纳信创 AI 初审合规意见"}
                            </div>
                          </td>
                          <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>
                            <button
                              type="button"
                              onClick={() => {
                                handleOpenTask(task);
                                setShowDocModal(true);
                              }}
                              className="btn-secondary"
                              style={{ padding: "3px 8px", fontSize: "0.74rem" }}
                            >
                              查看意见书
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* ======================================================================= */}
          {/* 视图四：规章制度库 (KNOWLEDGE_BASE) */}
          {/* ======================================================================= */}
          {globalNav === "KNOWLEDGE_BASE" && (
            <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              
              {/* 四大维度统计卡片 */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px" }}>
                <div className="glass-panel" style={{ padding: "14px 18px" }}>
                  <div style={{ fontSize: "0.74rem", color: "#0284c7" }}>企业内部规章制度</div>
                  <div style={{ fontSize: "1.3rem", fontWeight: 700, color: "#0f172a", marginTop: "2px" }}>
                    {knowledgeDocs.filter((d) => d.category === "INTERNAL_RULE").length} <span style={{ fontSize: "0.75rem", fontWeight: 400, color: "#94a3b8" }}>部</span>
                  </div>
                </div>

                <div className="glass-panel" style={{ padding: "14px 18px" }}>
                  <div style={{ fontSize: "0.74rem", color: "#059669" }}>技术文件与标准</div>
                  <div style={{ fontSize: "1.3rem", fontWeight: 700, color: "#0f172a", marginTop: "2px" }}>
                    {knowledgeDocs.filter((d) => d.category === "TECH_STANDARD").length} <span style={{ fontSize: "0.75rem", fontWeight: 400, color: "#94a3b8" }}>部</span>
                  </div>
                </div>

                <div className="glass-panel" style={{ padding: "14px 18px" }}>
                  <div style={{ fontSize: "0.74rem", color: "#d97706" }}>管理规范与细则</div>
                  <div style={{ fontSize: "1.3rem", fontWeight: 700, color: "#0f172a", marginTop: "2px" }}>
                    {knowledgeDocs.filter((d) => d.category === "MGMT_NORM").length} <span style={{ fontSize: "0.75rem", fontWeight: 400, color: "#94a3b8" }}>部</span>
                  </div>
                </div>

                <div className="glass-panel" style={{ padding: "14px 18px" }}>
                  <div style={{ fontSize: "0.74rem", color: "#7c3aed" }}>外部法律与国标</div>
                  <div style={{ fontSize: "1.3rem", fontWeight: 700, color: "#0f172a", marginTop: "2px" }}>
                    {knowledgeDocs.filter((d) => d.category === "EXTERNAL_LAW").length} <span style={{ fontSize: "0.75rem", fontWeight: 400, color: "#94a3b8" }}>部</span>
                  </div>
                </div>
              </div>

              {/* 过滤与搜索工具栏 */}
              <div className="glass-panel" style={{ padding: "14px 18px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                  
                  {/* 分类过滤器 */}
                  <div style={{ display: "flex", gap: "4px", background: "#f1f5f9", padding: "3px", borderRadius: "6px" }}>
                    <button
                      type="button"
                      onClick={() => setSelectedCategory("ALL")}
                      className={`role-tab ${selectedCategory === "ALL" ? "role-tab-active" : ""}`}
                    >
                      全部规章 ({knowledgeDocs.length})
                    </button>
                    {CATEGORY_DEFINITIONS.map((c) => (
                      <button
                        key={c.category}
                        type="button"
                        onClick={() => setSelectedCategory(c.category)}
                        className={`role-tab ${selectedCategory === c.category ? "role-tab-active" : ""}`}
                      >
                        {c.label} ({knowledgeDocs.filter((d) => d.category === c.category).length})
                      </button>
                    ))}
                  </div>

                  {/* 搜索 */}
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <input
                      type="text"
                      placeholder="搜索规章名称、文号或条款关键字..."
                      className="fde-input"
                      style={{ width: "260px", height: "32px", fontSize: "0.8rem" }}
                      value={searchKeyword}
                      onChange={(e) => setSearchKeyword(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* 规章列表 */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "12px" }}>
                {filteredDocs.map((doc) => (
                  <div key={doc.id} className="glass-panel" style={{ padding: "16px 20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#0f172a" }}>
                            {doc.title}
                          </h3>
                          <span style={{ fontSize: "0.7rem", padding: "1px 6px", borderRadius: "3px", background: "#f1f5f9", color: "#475569", fontWeight: 600 }}>
                            {doc.version}
                          </span>
                          <span style={{ fontSize: "0.7rem", padding: "1px 6px", borderRadius: "3px", background: "#ecfdf5", color: "#059669", fontWeight: 600 }}>
                            现行有效
                          </span>
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "3px" }}>
                          发文字号：<span className="mono">{doc.docNo}</span> · 编制部门：{doc.issuingBody} · 生效日期：{doc.publishDate} · 向量化切片：{doc.chunkCount} 个 ({doc.fileSize})
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedDocForChunks(doc)}
                        className="btn-secondary"
                        style={{ padding: "4px 10px", fontSize: "0.76rem" }}
                      >
                        检视向量切片
                      </button>
                    </div>

                    <div style={{ marginTop: "10px", fontSize: "0.82rem", color: "#334155", lineHeight: 1.6 }}>
                      {doc.summary}
                    </div>

                    <div style={{ marginTop: "8px", background: "#f8fafc", padding: "8px 12px", borderRadius: "4px", borderLeft: "3px solid #0284c7", fontSize: "0.8rem", color: "#475569" }}>
                      <strong>核心约束条款：</strong>{doc.sampleClause}
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

        </div>
      </main>

      {/* ========================================================================= */}
      {/* 弹窗：前序流转节点意见查阅详情模态框 */}
      {/* ========================================================================= */}
      {viewingNodeOpinion && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(15, 23, 42, 0.6)",
            display: "grid",
            placeItems: "center",
            zIndex: 9999,
            padding: "20px"
          }}
        >
          <div
            className="glass-panel"
            style={{
              width: "100%",
              maxWidth: "520px",
              padding: "22px",
              background: "#ffffff",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", borderBottom: "1px solid #e2e8f0", paddingBottom: "8px" }}>
              <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#0f172a" }}>
                审批节点流转意见明细
              </h3>
              <button
                type="button"
                onClick={() => setViewingNodeOpinion(null)}
                style={{ background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", color: "#94a3b8" }}
              >
                ×
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <div>
                <span style={{ fontSize: "0.75rem", color: "#64748b" }}>审批节点：</span>
                <strong style={{ fontSize: "0.86rem", color: "#0f172a" }}>{viewingNodeOpinion.nodeName}</strong>
              </div>

              <div>
                <span style={{ fontSize: "0.75rem", color: "#64748b" }}>处理责任人：</span>
                <strong style={{ fontSize: "0.86rem", color: "#0f172a" }}>
                  {viewingNodeOpinion.assignee}（{viewingNodeOpinion.roleTitle}）
                </strong>
              </div>

              <div>
                <span style={{ fontSize: "0.75rem", color: "#64748b" }}>签署时间：</span>
                <span className="mono" style={{ fontSize: "0.8rem", color: "#334155" }}>{viewingNodeOpinion.handleTime}</span>
              </div>

              <div style={{ marginTop: "4px" }}>
                <span style={{ fontSize: "0.75rem", color: "#64748b", display: "block", marginBottom: "4px" }}>签署意见记录：</span>
                <div style={{ background: "#f8fafc", padding: "10px 12px", borderRadius: "4px", border: "1px solid #e2e8f0", fontSize: "0.84rem", color: "#334155", lineHeight: 1.6 }}>
                  {viewingNodeOpinion.opinion || "无批注意见"}
                </div>
              </div>
            </div>

            <div style={{ marginTop: "16px", display: "flex", justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={() => setViewingNodeOpinion(null)}
                className="btn-secondary"
                style={{ padding: "4px 12px", fontSize: "0.8rem" }}
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
            {/* ========================================================================= */}
      {/* 弹窗一：随附原件 OCR 结构化解析全文与证据链穿透模态框 */}
      {/* ========================================================================= */}
      {viewingAttachment && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(15, 23, 42, 0.65)",
            display: "grid",
            placeItems: "center",
            zIndex: 9999,
            padding: "20px"
          }}
        >
          <div
            className="glass-panel"
            style={{
              width: "100%",
              maxWidth: "880px",
              background: "#ffffff",
              borderRadius: "8px",
              padding: "24px 28px",
              maxHeight: "88vh",
              overflowY: "auto",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.35)"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e2e8f0", paddingBottom: "12px", marginBottom: "16px" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#0f172a", margin: 0 }}>
                    📄 随附原件 OCR 文本结构化解析与证据链
                  </h3>
                  <span style={{ fontSize: "0.68rem", background: "#ecfdf5", color: "#059669", padding: "2px 6px", borderRadius: "3px", fontWeight: 600 }}>
                    置信度 99.2%
                  </span>
                </div>
                <div style={{ fontSize: "0.74rem", color: "#64748b", marginTop: "4px" }}>
                  文件名称：<strong style={{ color: "#334155" }}>{viewingAttachment.name}</strong> · 大小：{viewingAttachment.size} · 识别引擎：中润信创多模态版面切分引擎 v2.4 (Paddle/LayoutLM 容器部署)
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewingAttachment(null)}
                style={{ background: "none", border: "none", fontSize: "1.4rem", cursor: "pointer", color: "#94a3b8" }}
              >
                ×
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: "16px" }}>
              {/* 左侧：抽取的结构化要素字段 */}
              <div style={{ background: "#f8fafc", padding: "14px", borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "0.78rem" }}>
                <div style={{ fontWeight: 700, color: "#0f172a", marginBottom: "10px", paddingBottom: "6px", borderBottom: "1px solid #e2e8f0" }}>
                  抽取结构化要素（与单据自动勾稽项）：
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <div>
                    <span style={{ color: "#64748b" }}>合同抽取金额：</span>
                    <div className="mono" style={{ fontWeight: 700, color: "#0284c7" }}>
                      ¥{(viewingAttachment.extractedFields.contractAmount ?? formData.totalAmount).toLocaleString()} 元
                    </div>
                  </div>
                  <div>
                    <span style={{ color: "#64748b" }}>签约相对方：</span>
                    <div style={{ fontWeight: 600, color: "#0f172a" }}>
                      {viewingAttachment.extractedFields.supplierName || formData.supplierName}
                    </div>
                  </div>
                  <div>
                    <span style={{ color: "#64748b" }}>发票税率约定：</span>
                    <div style={{ color: "#0f172a" }}>
                      {viewingAttachment.extractedFields.taxRate || formData.taxRate}
                    </div>
                  </div>
                  <div>
                    <span style={{ color: "#64748b" }}>质量验收条款：</span>
                    <div style={{ color: viewingAttachment.extractedFields.acceptanceStandard?.includes("95%") ? "#dc2626" : "#0f172a", fontWeight: viewingAttachment.extractedFields.acceptanceStandard?.includes("95%") ? 700 : 400 }}>
                      {viewingAttachment.extractedFields.acceptanceStandard || formData.qualityStandard}
                    </div>
                  </div>
                  <div>
                    <span style={{ color: "#64748b" }}>约定管辖机构：</span>
                    <div style={{ color: "#0f172a" }}>
                      {viewingAttachment.extractedFields.disputeJurisdiction || formData.disputeJurisdiction}
                    </div>
                  </div>
                </div>
              </div>

              {/* 右侧：OCR 原文切片与条款高亮 */}
              <div style={{ background: "#ffffff", padding: "14px", borderRadius: "6px", border: "1px solid #cbd5e1" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", paddingBottom: "6px", borderBottom: "1px solid #f1f5f9" }}>
                  <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#0f172a" }}>原件正文识别原文（带关键证据高亮）：</span>
                  <span style={{ fontSize: "0.7rem", color: "#64748b" }}>密级：内部商密</span>
                </div>
                <div style={{
                  background: "#fdfefe",
                  border: "1px solid #e2e8f0",
                  padding: "12px",
                  borderRadius: "4px",
                  fontSize: "0.76rem",
                  lineHeight: 1.7,
                  color: "#334155",
                  fontFamily: "monospace",
                  whiteSpace: "pre-wrap",
                  maxHeight: "360px",
                  overflowY: "auto"
                }}>
                  {viewingAttachment.ocrExtractedText || "原件正文已完成版面切分识别，暂无进一步结构化文本段。"}
                </div>
              </div>
            </div>

            <div style={{ marginTop: "16px", display: "flex", justifyContent: "flex-end", gap: "8px" }}>
              <button
                type="button"
                onClick={() => setViewingAttachment(null)}
                className="btn-secondary"
                style={{ padding: "5px 14px", fontSize: "0.78rem" }}
              >
                关闭预览
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 弹窗二：要素勾稽比对“条款证据溯源”模态框 */}
      {/* ========================================================================= */}
      {viewingEvidenceItem && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(15, 23, 42, 0.65)",
            display: "grid",
            placeItems: "center",
            zIndex: 9999,
            padding: "20px"
          }}
        >
          <div
            className="glass-panel"
            style={{
              width: "100%",
              maxWidth: "760px",
              background: "#ffffff",
              borderRadius: "8px",
              padding: "24px",
              maxHeight: "85vh",
              overflowY: "auto",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.35)"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e2e8f0", paddingBottom: "10px", marginBottom: "16px" }}>
              <h3 style={{ fontSize: "0.98rem", fontWeight: 700, color: "#0f172a", margin: 0, display: "flex", alignItems: "center", gap: "6px" }}>
                <span>🔍</span> 勾稽要素证据链溯源：{viewingEvidenceItem.fieldName}
              </h3>
              <button
                type="button"
                onClick={() => setViewingEvidenceItem(null)}
                style={{ background: "none", border: "none", fontSize: "1.3rem", cursor: "pointer", color: "#94a3b8" }}
              >
                ×
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px" }}>
              <div style={{ background: "#f8fafc", padding: "10px 14px", borderRadius: "6px", border: "1px solid #e2e8f0" }}>
                <span style={{ fontSize: "0.72rem", color: "#64748b" }}>业务单据申报值：</span>
                <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#0f172a", marginTop: "2px" }}>
                  {viewingEvidenceItem.formValue}
                </div>
              </div>
              <div style={{ background: viewingEvidenceItem.status === "MISMATCH" ? "#fef2f2" : "#f8fafc", padding: "10px 14px", borderRadius: "6px", border: `1px solid ${viewingEvidenceItem.status === "MISMATCH" ? "#fecaca" : "#e2e8f0"}` }}>
                <span style={{ fontSize: "0.72rem", color: viewingEvidenceItem.status === "MISMATCH" ? "#dc2626" : "#64748b" }}>附件 OCR 抽取值：</span>
                <div style={{ fontSize: "0.9rem", fontWeight: 700, color: viewingEvidenceItem.status === "MISMATCH" ? "#dc2626" : "#0f172a", marginTop: "2px" }}>
                  {viewingEvidenceItem.attachmentValue}
                </div>
              </div>
            </div>

            <div style={{ background: "#f8fafc", padding: "12px", borderRadius: "6px", border: "1px solid #e2e8f0", marginBottom: "14px", fontSize: "0.78rem" }}>
              <span style={{ fontWeight: 700, color: "#334155" }}>差异与合规判定：</span>
              <div style={{ color: viewingEvidenceItem.status === "MISMATCH" ? "#dc2626" : "#475569", marginTop: "4px", lineHeight: 1.6 }}>
                {viewingEvidenceItem.detail}
              </div>
            </div>

            <div style={{ background: "#ffffff", padding: "12px", borderRadius: "6px", border: "1px solid #cbd5e1" }}>
              <div style={{ fontSize: "0.76rem", fontWeight: 700, color: "#0f172a", marginBottom: "6px" }}>
                随附原件条文原文切片（OCR 锚点来源）：
              </div>
              <div style={{
                background: "#fdfefe",
                border: "1px solid #e2e8f0",
                padding: "10px",
                borderRadius: "4px",
                fontSize: "0.75rem",
                lineHeight: 1.7,
                color: "#334155",
                fontFamily: "monospace",
                whiteSpace: "pre-wrap",
                maxHeight: "220px",
                overflowY: "auto"
              }}>
                {attachments[0]?.ocrExtractedText || "原件对应条款片段已收录。"}
              </div>
            </div>

            <div style={{ marginTop: "16px", display: "flex", justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={() => setViewingEvidenceItem(null)}
                className="btn-secondary"
                style={{ padding: "5px 14px", fontSize: "0.78rem" }}
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 弹窗三：规章制度条文全文与罚则释义抽屉 */}
      {/* ========================================================================= */}
      {viewingRegulation && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(15, 23, 42, 0.65)",
            display: "grid",
            placeItems: "center",
            zIndex: 9999,
            padding: "20px"
          }}
        >
          <div
            className="glass-panel"
            style={{
              width: "100%",
              maxWidth: "680px",
              background: "#ffffff",
              borderRadius: "8px",
              padding: "24px",
              maxHeight: "85vh",
              overflowY: "auto",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.35)"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e2e8f0", paddingBottom: "10px", marginBottom: "14px" }}>
              <div>
                <h3 style={{ fontSize: "0.98rem", fontWeight: 700, color: "#0f172a", margin: 0 }}>
                  📜 规章制度条文与合规红线释义
                </h3>
                <div style={{ fontSize: "0.72rem", color: "#64748b", marginTop: "2px" }}>
                  发文文号：{viewingRegulation.docNo || "中润规审〔2025〕08号"} · 发文机构：{viewingRegulation.issuingBody || "集团风控合规部"}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewingRegulation(null)}
                style={{ background: "none", border: "none", fontSize: "1.3rem", cursor: "pointer", color: "#94a3b8" }}
              >
                ×
              </button>
            </div>

            <div style={{ background: "#f8fafc", padding: "12px", borderRadius: "6px", border: "1px solid #e2e8f0", marginBottom: "12px" }}>
              <div style={{ fontWeight: 700, color: "#0f172a", fontSize: "0.85rem", marginBottom: "6px" }}>
                {viewingRegulation.ruleName} · {viewingRegulation.clause}
              </div>
              <div style={{ fontSize: "0.78rem", color: "#334155", lineHeight: 1.7, fontStyle: "italic", borderLeft: "3px solid #0284c7", paddingLeft: "10px", margin: "6px 0" }}>
                “{viewingRegulation.snippet}”
              </div>
            </div>

            <div style={{ background: "#ffffff", padding: "12px", borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "0.78rem", lineHeight: 1.7 }}>
              <div style={{ fontWeight: 700, color: "#0f172a", marginBottom: "4px" }}>
                国企监管适用说明与追责依据：
              </div>
              <p style={{ color: "#475569", margin: "4px 0" }}>
                {viewingRegulation.applicability}
              </p>
              <p style={{ color: "#64748b", fontSize: "0.74rem", margin: "4px 0" }}>
                根据《中央企业合规管理办法》及集团重大决策终身追责规定，该条款为合同合规初审阶段的刚性核查指标，不满足时经办部门必须补全要件或终止签署。
              </p>
            </div>

            <div style={{ marginTop: "16px", display: "flex", justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={() => setViewingRegulation(null)}
                className="btn-secondary"
                style={{ padding: "5px 14px", fontSize: "0.78rem" }}
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 弹窗：正式国企红头《合同合规审查意见书》导出模态框 */}
      {/* ========================================================================= */}
      {showDocModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(15, 23, 42, 0.65)",
            display: "grid",
            placeItems: "center",
            zIndex: 9999,
            padding: "20px"
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "800px",
              background: "#ffffff",
              borderRadius: "8px",
              padding: "36px 44px",
              maxHeight: "90vh",
              overflowY: "auto",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.35)",
              fontFamily: "SimSun, 'Songti SC', 'Songti TC', serif"
            }}
          >
            {/* 顶栏控制按钮 */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", borderBottom: "1px solid #e2e8f0", paddingBottom: "10px" }}>
              <span style={{ fontSize: "0.8rem", color: "#64748b", fontFamily: "sans-serif" }}>
                正式公文排版预览 · 遵循党政机关公文格式国家标准 (GB/T 9704-2012)
              </span>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  type="button"
                  onClick={() => alert("已触发打印驱动，正在生成公文 PDF 归档件...")}
                  className="glow-btn"
                  style={{ padding: "4px 12px", fontSize: "0.8rem", fontFamily: "sans-serif" }}
                >
                  打印 / 导出 PDF
                </button>
                <button
                  type="button"
                  onClick={() => setShowDocModal(false)}
                  style={{ background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", color: "#94a3b8" }}
                >
                  ×
                </button>
              </div>
            </div>

            {/* 红头公文大标题区 */}
            <div style={{ textAlign: "center", marginBottom: "16px" }}>
              <div style={{ fontSize: "1.6rem", fontWeight: 700, color: "#dc2626", letterSpacing: "2px" }}>
                中润农垦食品集团有限公司
              </div>
              <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "#dc2626", marginTop: "4px", letterSpacing: "1px" }}>
                合同合规与内控审查意见书
              </div>
              <div style={{ height: "3px", background: "#dc2626", marginTop: "12px", marginBottom: "2px" }}></div>
              <div style={{ height: "1px", background: "#dc2626", marginBottom: "12px" }}></div>
            </div>

            {/* 文号与密级 */}
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", color: "#334155", marginBottom: "16px" }}>
              <span>发文字号：中润合审〔2026〕{formData.id.replace("REQ-", "")}号</span>
              <span>密级与缓急：内部商密 · 急件</span>
            </div>

            {/* 基础公文表格 */}
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                border: "1px solid #334155",
                fontSize: "0.84rem",
                marginBottom: "16px"
              }}
            >
              <tbody>
                <tr>
                  <td style={{ border: "1px solid #334155", padding: "6px 10px", background: "#f8fafc", width: "18%", fontWeight: 600 }}>合同名称</td>
                  <td style={{ border: "1px solid #334155", padding: "6px 10px", width: "42%" }}>{formData.contractTitle}</td>
                  <td style={{ border: "1px solid #334155", padding: "6px 10px", background: "#f8fafc", width: "18%", fontWeight: 600 }}>合同编号</td>
                  <td style={{ border: "1px solid #334155", padding: "6px 10px", width: "22%" }}>{formData.contractNo}</td>
                </tr>
                <tr>
                  <td style={{ border: "1px solid #334155", padding: "6px 10px", background: "#f8fafc", fontWeight: 600 }}>呈批单位/部门</td>
                  <td style={{ border: "1px solid #334155", padding: "6px 10px" }}>{formData.partyA} / {formData.department}</td>
                  <td style={{ border: "1px solid #334155", padding: "6px 10px", background: "#f8fafc", fontWeight: 600 }}>经办责任人</td>
                  <td style={{ border: "1px solid #334155", padding: "6px 10px" }}>{formData.applicant}</td>
                </tr>
                <tr>
                  <td style={{ border: "1px solid #334155", padding: "6px 10px", background: "#f8fafc", fontWeight: 600 }}>签约相对方</td>
                  <td style={{ border: "1px solid #334155", padding: "6px 10px" }}>{formData.supplierName}</td>
                  <td style={{ border: "1px solid #334155", padding: "6px 10px", background: "#f8fafc", fontWeight: 600 }}>呈批标的金额</td>
                  <td style={{ border: "1px solid #334155", padding: "6px 10px", fontWeight: 700 }}>¥{formData.totalAmount.toLocaleString()} 元</td>
                </tr>
              </tbody>
            </table>

            {/* 正文审查意见 */}
            <div style={{ fontSize: "0.88rem", color: "#0f172a", lineHeight: 1.8, marginBottom: "20px" }}>
              <p style={{ fontWeight: 700, marginBottom: "6px" }}>一、签约资质与前置决议审查情况</p>
              <p style={{ textIndent: "2em", color: "#334155" }}>
                经查验，相对方统一社会信用代码为 {formData.supplierCredit.creditCode}，法定代表人 {formData.supplierCredit.legalPerson}，资信评级为 {formData.supplierCredit.creditRating} 级。该呈批事项{formData.isMajorPartyMatter ? "属于“三重一大”重大决策范围" : "未触及大额重大事项线"}，经办人{formData.hasMajorPartyResolution ? `已完备前置党委会审议纪要 (${formData.majorPartyResolutionNo})` : "未提交党委会审议会议纪要，存在合规程序瑕疵"}。
              </p>

              <p style={{ fontWeight: 700, marginTop: "12px", marginBottom: "6px" }}>二、商务结算与扫描件勾稽核验意见</p>
              <p style={{ textIndent: "2em", color: "#334155" }}>
                申报总额为 {formData.totalAmountChinese}（¥{formData.totalAmount.toLocaleString()} 元），适用税率 {formData.taxRate}。
                {analysisResult?.crossChecks.some((c) => c.status === "MISMATCH")
                  ? "【重大预警】：送审附件扫描件提取结算总额与申报表单存在 ¥50,000.00 元勾稽差额，税率与增值税专票种类存在出入，根据集团《合同管理办法》必须退回经办人重核。"
                  : "经比对送审附件扫描件，金额、结算条款与付款节点勾稽一致，预算指标编号核对无误。"}
              </p>

              <p style={{ fontWeight: 700, marginTop: "12px", marginBottom: "6px" }}>三、技术质量与食品安全底线审查</p>
              <p style={{ textIndent: "2em", color: "#334155" }}>
                合同约定质量标准为：“{formData.qualityStandard}”。
                {formData.qualityStandard.includes("95%")
                  ? "【严重违规】：供方合同设定抽检 95% 合格率收货且免第三方 CMA 质检，违背我集团《食品安全质量合规红线管理规范》第十二条关于出厂合格率不低于 99.8% 之刚性要求，依法不得予以签批！"
                  : "质量指标符合国家 GB 强制标准及集团原粮入库理化指标，未见免责或弱化质安责任条款。"}
              </p>

              <p style={{ fontWeight: 700, marginTop: "12px", marginBottom: "6px" }}>四、综合审查结论</p>
              <div style={{ background: "#f8fafc", padding: "10px 14px", border: "1px solid #cbd5e1", borderRadius: "4px", color: "#1e293b" }}>
                <strong>【初审裁定】：</strong>{analysisResult?.verdictTitle}。{analysisResult?.verdictSummary}
              </div>
            </div>

            {/* 签批签署区与防伪印鉴 */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginTop: "30px", borderTop: "1px solid #334155", paddingTop: "16px", position: "relative" }}>
              <div>
                <div style={{ fontSize: "0.82rem", color: "#475569" }}>风控合规部初审：</div>
                <div style={{ marginTop: "8px", fontSize: "0.9rem", fontWeight: 700 }}>陈律（法务风控主管）</div>
                <div style={{ fontSize: "0.72rem", color: "#64748b" }}>已通过本地信创大模型审查引擎自动化初核存证</div>
              </div>

              <div style={{ textAlign: "right", position: "relative" }}>
                <div style={{ fontSize: "0.82rem", color: "#475569" }}>分管副总经理终审签批：</div>
                <div style={{ marginTop: "6px", fontSize: "1.05rem", fontWeight: 700, color: currentTask.status === "PENDING_REVIEW" ? "#94a3b8" : "#0284c7" }}>
                  {currentTask.status === "PENDING_REVIEW" ? "赵志远（待签批）" : "赵志远（已签署）"}
                </div>
                <div style={{ fontSize: "0.72rem", color: currentTask.status === "PENDING_REVIEW" ? "#94a3b8" : "#059669", fontWeight: 600, marginTop: "2px" }}>
                  {currentTask.status === "PENDING_REVIEW" ? "【合规初审草案待核签】" : `存证时间戳：${currentTask.humanSignOffAt || new Date().toLocaleString()}`}
                </div>
                {currentTask.status !== "PENDING_REVIEW" && (
                  <div className="mono" style={{ fontSize: "0.66rem", color: "#64748b", marginTop: "2px" }}>
                    CFCA认证文号：CFCA-SOE-2026-{formData.id.replace("REQ-", "")}
                  </div>
                )}

                {/* 电子红公章 (SVG 逼真红印，仅在已签署时呈现) */}
                {currentTask.status !== "PENDING_REVIEW" && (
                  <div
                    style={{
                      position: "absolute",
                      right: "-10px",
                      top: "-25px",
                      width: "125px",
                      height: "125px",
                      borderRadius: "50%",
                      border: "3px solid #dc2626",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#dc2626",
                      opacity: 0.85,
                      transform: "rotate(-12deg)",
                      pointerEvents: "none",
                      fontFamily: "SimSun, serif",
                      userSelect: "none"
                    }}
                  >
                    <div style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "1px" }}>中润农垦食品</div>
                    <div style={{ fontSize: "1.1rem", margin: "1px 0" }}>★</div>
                    <div style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "1px" }}>合同审查专用章</div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 弹窗：上传新规章模态框 */}
      {/* ========================================================================= */}
      {showUploadModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(15, 23, 42, 0.6)",
            display: "grid",
            placeItems: "center",
            zIndex: 999,
            padding: "20px"
          }}
        >
          <div
            className="glass-panel"
            style={{
              width: "100%",
              maxWidth: "640px",
              padding: "24px",
              background: "#ffffff",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", borderBottom: "1px solid #e2e8f0", paddingBottom: "10px" }}>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#0f172a" }}>
                上传与构建企业规章制度向量知识库
              </h3>
              <button
                type="button"
                onClick={() => setShowUploadModal(false)}
                style={{ background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", color: "#94a3b8" }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              
              <div
                style={{
                  border: "2px dashed #cbd5e1",
                  borderRadius: "6px",
                  padding: "18px",
                  textAlign: "center",
                  background: "#f8fafc",
                  cursor: "pointer"
                }}
              >
                <div style={{ fontSize: "0.86rem", fontWeight: 600, color: "#0f172a" }}>
                  点击选择或将 PDF/Word/国标文件 拖拽至此处
                </div>
                <div style={{ fontSize: "0.74rem", color: "#64748b", marginTop: "4px" }}>
                  支持 .pdf, .docx, .txt · 自动提取目录层级、条款约束与实体关键词
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={{ fontSize: "0.76rem", fontWeight: 600, color: "#475569", display: "block", marginBottom: "3px" }}>
                    规章/文件标题 *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="例：食用植物油精炼操作规程"
                    className="fde-input"
                    value={newDocTitle}
                    onChange={(e) => setNewDocTitle(e.target.value)}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "0.76rem", fontWeight: 600, color: "#475569", display: "block", marginBottom: "3px" }}>
                    所属分类 *
                  </label>
                  <select
                    className="fde-input"
                    value={newDocCategory}
                    onChange={(e) => setNewDocCategory(e.target.value as DocCategory)}
                  >
                    <option value="INTERNAL_RULE">企业内部规章制度</option>
                    <option value="TECH_STANDARD">技术文件与标准</option>
                    <option value="MGMT_NORM">管理规范与细则</option>
                    <option value="EXTERNAL_LAW">外部法律法规与国标</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={{ fontSize: "0.76rem", fontWeight: 600, color: "#475569", display: "block", marginBottom: "3px" }}>
                    发文字号
                  </label>
                  <input
                    type="text"
                    placeholder="如：中润规字〔2026〕01号"
                    className="fde-input"
                    value={newDocNo}
                    onChange={(e) => setNewDocNo(e.target.value)}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "0.76rem", fontWeight: 600, color: "#475569", display: "block", marginBottom: "3px" }}>
                    版本编号
                  </label>
                  <input
                    type="text"
                    className="fde-input"
                    value={newDocVersion}
                    onChange={(e) => setNewDocVersion(e.target.value)}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "0.76rem", fontWeight: 600, color: "#475569", display: "block", marginBottom: "3px" }}>
                    编制机构/部门
                  </label>
                  <input
                    type="text"
                    placeholder="如：质量技术部"
                    className="fde-input"
                    value={newDocIssuingBody}
                    onChange={(e) => setNewDocIssuingBody(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: "0.76rem", fontWeight: 600, color: "#475569", display: "block", marginBottom: "3px" }}>
                  规章摘要与主旨说明
                </label>
                <textarea
                  rows={2}
                  className="fde-input"
                  placeholder="请输入该制度覆盖的核心业务域与基本控制要求..."
                  value={newDocSummary}
                  onChange={(e) => setNewDocSummary(e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: "0.76rem", fontWeight: 600, color: "#475569", display: "block", marginBottom: "3px" }}>
                  关键约束条款（测试抽取）
                </label>
                <textarea
                  rows={2}
                  className="fde-input"
                  placeholder="例：进厂检验不得少于24项理化指标，未达标批次严禁投入生产并扣罚履约金。"
                  value={newDocClause}
                  onChange={(e) => setNewDocClause(e.target.value)}
                />
              </div>

              {uploadingStage && (
                <div style={{ background: "#f0f9ff", padding: "8px 12px", borderRadius: "4px", border: "1px solid #bae6fd", fontSize: "0.8rem", color: "#0284c7" }}>
                  <strong>RAG 知识库流水线：</strong>{uploadingStage}
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px", marginTop: "4px" }}>
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="btn-secondary"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={Boolean(uploadingStage)}
                  className="glow-btn"
                >
                  {uploadingStage ? "处理中..." : "解析并切片入库"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 弹窗：规章向量分块查看抽屉 (Chunks Inspector) */}
      {/* ========================================================================= */}
      {selectedDocForChunks && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(15, 23, 42, 0.6)",
            display: "grid",
            placeItems: "center",
            zIndex: 999,
            padding: "20px"
          }}
        >
          <div
            className="glass-panel"
            style={{
              width: "100%",
              maxWidth: "760px",
              padding: "22px",
              background: "#ffffff",
              maxHeight: "85vh",
              overflowY: "auto"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", borderBottom: "1px solid #e2e8f0", paddingBottom: "8px" }}>
              <div>
                <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#0f172a" }}>
                  规章向量切片详情 (Semantic Chunks Inspector)
                </h3>
                <p style={{ fontSize: "0.75rem", color: "#64748b" }}>
                  {selectedDocForChunks.title} · 共切分 {selectedDocForChunks.chunkCount} 个向量切片
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDocForChunks(null)}
                style={{ background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", color: "#94a3b8" }}
              >
                ×
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ background: "#f8fafc", padding: "10px 12px", borderRadius: "6px", border: "1px solid #e2e8f0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                  <span className="mono" style={{ fontSize: "0.74rem", fontWeight: 700, color: "#0284c7" }}>Chunk #01 · 篇章范围与发文对象</span>
                  <span style={{ fontSize: "0.7rem", color: "#64748b" }}>Token 长度: 342 · 嵌入向量已固化</span>
                </div>
                <div style={{ fontSize: "0.8rem", color: "#334155", lineHeight: 1.5 }}>
                  【适用对象】本办法适用于集团全资及控股子公司、各下属生产加工厂的全部对外采购与外包服务。未经合规前置审查，任何单据不得流转。
                </div>
              </div>

              <div style={{ background: "#f0f9ff", padding: "10px 12px", borderRadius: "6px", border: "1px solid #bae6fd" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                  <span className="mono" style={{ fontSize: "0.74rem", fontWeight: 700, color: "#0284c7" }}>Chunk #02 · 核心限制性条文 (高优检索权重)</span>
                  <span style={{ fontSize: "0.7rem", color: "#0284c7" }}>匹配阈值: 0.92 · 刚性合规红线</span>
                </div>
                <div style={{ fontSize: "0.8rem", color: "#0f172a", lineHeight: 1.5, fontWeight: 500 }}>
                  {selectedDocForChunks.sampleClause}
                </div>
              </div>

              <div style={{ background: "#f8fafc", padding: "10px 12px", borderRadius: "6px", border: "1px solid #e2e8f0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                  <span className="mono" style={{ fontSize: "0.74rem", fontWeight: 700, color: "#0284c7" }}>Chunk #03 · 违约追偿与内控问责</span>
                  <span style={{ fontSize: "0.7rem", color: "#64748b" }}>Token 长度: 410 · 追责条款</span>
                </div>
                <div style={{ fontSize: "0.8rem", color: "#334155", lineHeight: 1.5 }}>
                  【问责与审计】对规避集体审议程序、虚构采购事实或未执行质检验收造成重大经济损失的，依法追究直接责任人与分管领导经济责任。
                </div>
              </div>
            </div>

            <div style={{ marginTop: "14px", display: "flex", justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={() => setSelectedDocForChunks(null)}
                className="btn-secondary"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
