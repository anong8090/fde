// types/fde.ts
// FDE 国企 AI 审批提效与合规穿透演示系统 — 核心数据契约（深度生产版）

export type SourceSystem = "OA协同办公系统" | "ERP供应链采购系统" | "SAP物资主数据平台" | "外部商旅与物流平台";
export type TaskRiskLevel = "HIGH_RISK" | "WARNING" | "NORMAL";
export type TaskApprovalStatus = "PENDING_REVIEW" | "REVIEWING" | "APPROVED" | "REJECTED" | "SUPPLEMENT_REQUIRED";

export type DocCategory = "INTERNAL_RULE" | "TECH_STANDARD" | "MGMT_NORM" | "EXTERNAL_LAW";

// 知识库规章文档
export interface KnowledgeDocument {
  id: string;
  title: string;
  category: DocCategory;
  categoryLabel: string;
  docNo: string;              // 规章发文字号 (如: 中润规字〔2025〕08号)
  version: string;            // 版本标识 (如: v2025.1 现行版)
  status: "ACTIVE" | "REVISED" | "DRAFT";
  publishDate: string;        // 发文/生效日期
  issuingBody: string;        // 发文机关/编制部门
  fileSize: string;
  chunkCount: number;         // 向量化切片数
  summary: string;
  clausesCount: number;
  sampleClause: string;
}

// 待办审批流推送单据
export interface PushTaskItem {
  id: string;                    // 单据唯一标识 (如 REQ-202609-001)
  caseId: string;                // 对应 Mock 案例 ID
  contractTitle: string;         // 合同标题
  contractNo: string;            // 合同编号
  department: string;            // 申报部门
  applicant: string;             // 经办人
  supplierName: string;          // 供应商
  totalAmount: number;           // 申报金额 (元)
  sourceSystem: SourceSystem;    // 来源系统
  pushedAt: string;              // 推送接收时间
  riskLevel: TaskRiskLevel;      // AI 静默初审风险等级
  status: TaskApprovalStatus;    // 流程审批状态
  alertSnippet: string;          // 异常预警摘要提示
  humanReviewNote?: string;      // 人工签批留痕批注
  humanSignOffAt?: string;       // 人工签批时间
}

// 审批流转节点（时序图）
export interface WorkflowNode {
  stepIndex: number;
  nodeName: string;              // 如: 经办人发起、部门初审、财务核算、法务风控、分管领导审批
  assignee: string;              // 责任人
  roleTitle: string;             // 角色
  status: "FINISHED" | "CURRENT" | "WAITING";
  opinion?: string;              // 历史意见
  handleTime?: string;           // 处理时间
}

// 供应商征信与资质画像
export interface SupplierCreditProfile {
  creditCode: string;            // 统一社会信用代码
  legalPerson: string;           // 法定代表人
  registeredCapital: string;     // 注册资本
  creditRating: "AAA" | "AA" | "A" | "B" | "BLACKLIST"; // 资信等级
  riskStatus: "NORMAL" | "LAWSUIT_ALERT" | "QUALITY_PENALTY" | "ABNORMAL";
  riskDetails: string[];         // 司法诉讼/行政处罚摘要
}

// 深度国企合同呈批表单字段
export interface ApprovalFormData {
  id: string;
  caseId: string;
  
  // 1. 基本信息与签约主体
  contractTitle: string;         // 合同名称
  contractNo: string;            // 合同系统编号
  contractType: string;          // 合同分类 (大宗原料/技术服务/物流冷链/辅料采购)
  partyA: string;                // 甲方我方签约单位 (如: 中润农垦第一食品加工有限公司)
  supplierName: string;          // 乙方相对方全称
  supplierCredit: SupplierCreditProfile; // 乙方征信资质画像
  department: string;            // 呈批部门
  applicant: string;             // 经办人
  applicantPhone: string;        // 经办人联系电话
  applyDate: string;             // 申请发起日期
  signingPlace: string;          // 拟签约地点

  // 2. 商务与价款结算
  totalAmount: number;           // 申报含税总标的 (元)
  totalAmountChinese: string;    // 含税总金额大写 (如: 人民币壹佰贰拾万元整)
  untaxedAmount: number;         // 不含税金额 (元)
  taxRate: string;               // 发票与税率类型 (如: 9% 增值税专用发票)
  budgetSubject: string;         // 归属年度预算科目
  budgetCode: string;            // 财务预算编码
  procurementType: string;       // 采购方式 (集中竞价/单一来源直签/年度名录直选)
  paymentMethod: string;         // 结算方式描述
  prepaymentRatio: number;       // 预付款比例 %
  progressPaymentRatio: number;  // 到货进度款比例 %
  warrantyRatio: number;         // 质保金留存比例 %
  bankAccount: string;           // 供方对公指定收款账户 (防欺诈核验)
  
  // 3. 履约要求与技术质安
  deliveryStartDate: string;     // 履约起始日期
  deliveryEndDate: string;       // 履约截止日期
  deliveryLocation: string;      // 交付地点
  qualityStandard: string;       // 质量与验收标准 (GB国标、抽检批次标准)
  warrantyPeriod: string;        // 质保周期
  disputeJurisdiction: string;   // 争议解决管辖机构 (约定管辖)
  liabilityCapClause: string;    // 违约赔偿责任上限约定

  // 4. 前置决议与合规依据
  isMajorPartyMatter: boolean;   // 是否属于"三重一大"事项
  hasMajorPartyResolution: boolean; // 是否具备前置会议纪要
  majorPartyResolutionNo?: string;  // 党委会/办公会纪要文号 (如: 中润党会纪〔2026〕12号)
  approvalBasisDoc: string;      // 采购立项批文号/招投标归档编号
  antiSplitStatement: boolean;   // 经办人承诺“绝无化整为零拆单规避审批”声明
  summary: string;               // 呈批事项背景与请示理由
}

export interface AttachmentFile {
  id: string;
  name: string;
  size: string;
  type: string;
  ocrExtractedText: string;
  extractedFields: {
    contractAmount?: number;
    supplierName?: string;
    acceptanceStandard?: string;
    warrantyClause?: string;
    deliveryDays?: number;
    disputeJurisdiction?: string;
    taxRate?: string;
  };
}

export interface CrossCheckItem {
  fieldName: string;
  formValue: string;
  attachmentValue: string;
  status: "MATCH" | "MISMATCH" | "MISSING" | "WARNING";
  detail: string;
}

export interface KnowledgeCitation {
  ruleName: string;         // 制度名称
  clause: string;           // 章节条款
  version: string;          // 制度有效版本
  snippet: string;          // 原文切片
  applicability: string;    // 适用理由
  status: "COMPLIANT" | "VIOLATION" | "NOTICE";
}

export interface RoleReviewOpinion {
  roleId: "FINANCE" | "LEGAL" | "GENERAL_MANAGER";
  roleName: string;
  roleBadge: string;
  verdict: "AGREE" | "REQUIRE_SUPPLEMENT" | "REJECT" | "EXPEDITE_PASS";
  verdictLabel: string;
  opinionText: string;
  keyCheckPoints: string[];
}

export interface FdeAgentTraceStep {
  step: number;
  phase: "FORM_PARSE" | "ATTACHMENT_OCR" | "RAG_GROUNDING" | "MULTI_ROLE_SYNTHESIS";
  phaseTitle: string;
  thought: string;
  toolAction?: string;
  observation?: any;
  status: "RUNNING" | "DONE" | "ALERT";
}

export interface FdeAnalysisResult {
  overallVerdict: "APPROVED_FAST" | "REQUIRE_SUPPLEMENT" | "HIGH_RISK_WARNING";
  verdictTitle: string;
  verdictSummary: string;
  crossChecks: CrossCheckItem[];
  citations: KnowledgeCitation[];
  roleOpinions: RoleReviewOpinion[];
  workflowNodes: WorkflowNode[];
  actionItems: string[];
  executionStats: {
    durationMs: number;
    tokensScanned: number;
    rulesChecked: number;
    confidenceScore: number;
  };
}
