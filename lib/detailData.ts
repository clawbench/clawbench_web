import { benchmarkData } from './data';

export interface TaskResult {
  id: string;
  name: string;
  category: string;
  method: 'automated' | 'llm_judge' | 'hybrid';
  score: number;
  maxScore: number;
  criteria?: { name: string; score: number }[];
}

export interface CategoryScore {
  name: string;
  score: number;
  maxScore: number;
  taskCount: number;
}

export interface ModelDetailData {
  model: string;
  provider: string;
  type: 'open' | 'proprietary';
  logo?: string;
  bestTime?: number;
  bestCost?: number | string | null;
  valueScore?: number | string | null;
  overallScore: number;
  totalPoints: number;
  maxPoints: number;
  submissionTime: string;
  runInfo: string;
  openClawVersion: string;
  benchmarkVersion: string;
  submissionId: string;
  categories: CategoryScore[];
  tasks: TaskResult[];
  hardware: {
    cpu: string;
    memory: string;
    architecture: string;
    os: string;
  };
}

const CATEGORIES = [
  "Office Collaboration",
  "Information Retrieval and Research",
  "Content Creation",
  "Data Processing and Analysis",
  "Software Engineering"
];

const TASKS = [
  { id: 'task_sq_01_meeting_coordination', name: 'Meeting Coordination', category: 'Office Collaboration', method: 'automated' },
  { id: 'task_sq_02_weather_check', name: 'Weather Check', category: 'Office Collaboration', method: 'automated' },
  { id: 'task_sq_03_meeting_summary', name: 'Meeting Summary', category: 'Office Collaboration', method: 'hybrid' },
  { id: 'task_sq_04_interview_invitation', name: 'Interview Invitation', category: 'Office Collaboration', method: 'llm_judge' },
  { id: 'task_sq_05_travel_reimbursement', name: 'Travel Reimbursement', category: 'Office Collaboration', method: 'hybrid' },
  { id: 'task_sq_06_onboarding_asset_provisioning', name: 'Onboarding Asset Provisioning', category: 'Office Collaboration', method: 'automated' },
  { id: 'task_sq_07_stock_price_research', name: 'Stock Price Research', category: 'Information Retrieval and Research', method: 'automated' },
  { id: 'task_sq_08_email_retrieval', name: 'Email Retrieval', category: 'Information Retrieval and Research', method: 'hybrid' },
  { id: 'task_sq_09_news_briefing', name: 'News Briefing', category: 'Information Retrieval and Research', method: 'hybrid' },
  { id: 'task_sq_10_report_comprehension', name: 'Report Comprehension', category: 'Information Retrieval and Research', method: 'automated' },
  { id: 'task_sq_11_market_research', name: 'Market Research', category: 'Information Retrieval and Research', method: 'hybrid' },
  { id: 'task_sq_12_long_term_memory_retrieval', name: 'Long-term Memory Retrieval', category: 'Information Retrieval and Research', method: 'hybrid' },
  { id: 'task_sq_13_blog_writting', name: 'Blog Writting', category: 'Content Creation', method: 'llm_judge' },
  { id: 'task_sq_14_report_summary', name: 'Report Summarization', category: 'Content Creation', method: 'llm_judge' },
  { id: 'task_sq_15_content_transformation', name: 'Content Transformation', category: 'Content Creation', method: 'llm_judge' },
  { id: 'task_sq_16_script_creation', name: 'Scipt Creation', category: 'Content Creation', method: 'hybrid' },
  { id: 'task_sq_17_pitch_deck_structuring', name: 'Pitch Deck Structuring', category: 'Content Creation', method: 'hybrid' },
  { id: 'task_sq_18_content_audit', name: 'Content Audit', category: 'Content Creation', method: 'hybrid' },
  { id: 'task_sq_19_data_cleaning_etl', name: 'Data Cleaning & ETL', category: 'Data Processing and Analysis', method: 'hybrid' },
  { id: 'task_sq_20_data_integration', name: 'Data Integration', category: 'Data Processing and Analysis', method: 'hybrid' },
  { id: 'task_sq_21_data_anomaly_detection', name: 'Data Anomaly Detection', category: 'Data Processing and Analysis', method: 'hybrid' },
  { id: 'task_sq_22_visual_reporting', name: 'Visual Report', category: 'Data Processing and Analysis', method: 'hybrid' },
  { id: 'task_sq_23_pii_redaction', name: 'Pii Redaction', category: 'Data Processing and Analysis', method: 'hybrid' },
  { id: 'task_sq_24_sales_forecasting', name: 'Sales Forecasting', category: 'Data Processing and Analysis', method: 'hybrid' },
  { id: 'task_sq_25_log_triage', name: 'Log Triage', category: 'Software Engineering', method: 'automated' },
  { id: 'task_sq_26_api_config_setup', name: 'API Config Setup', category: 'Software Engineering', method: 'automated' },
  { id: 'task_sq_27_enviroment_provisioning', name: 'Environment Provisioning', category: 'Software Engineering', method: 'automated' },
  { id: 'task_sq_28_e2e_scripting', name: 'E2E Scripting', category: 'Software Engineering', method: 'automated' },
  { id: 'task_sq_29_bug_diagnosis_and_fix', name: 'Bug Diagnosis and Fix', category: 'Software Engineering', method: 'automated' },
  { id: 'task_sq_30_code_refactoring', name: 'Code Refactoring', category: 'Software Engineering', method: 'automated' }
] as const;

const SPECIAL_MODEL_TASK_SCORES: Record<string, Record<string, number>> = {
  "Doubao-Seed-2.0-lite": {
    "task_sq_01_meeting_coordination": 100,
    "task_sq_02_weather_check": 100,
    "task_sq_03_meeting_summary": 86.67,
    "task_sq_04_interview_invitation": 100,
    "task_sq_05_travel_reimbursement": 100,
    "task_sq_06_onboarding_asset_provisioning": 70,
    "task_sq_07_stock_price_research": 100,
    "task_sq_08_email_retrieval": 97.6,
    "task_sq_09_news_briefing": 100,
    "task_sq_10_report_comprehension": 100,
    "task_sq_11_market_research": 86,
    "task_sq_12_long_term_memory_retrieval": 97.5,
    "task_sq_13_blog_writting": 100,
    "task_sq_14_report_summary": 99,
    "task_sq_15_content_transformation": 89,
    "task_sq_16_script_creation": 94,
    "task_sq_17_pitch_deck_structuring": 94.44,
    "task_sq_18_content_audit": 90,
    "task_sq_19_data_cleaning_etl": 96.5,
    "task_sq_20_data_integration": 100,
    "task_sq_21_data_anomaly_detection": 88,
    "task_sq_22_visual_reporting": 94,
    "task_sq_23_pii_redaction": 91.25,
    "task_sq_24_sales_forecasting": 88.67,
    "task_sq_25_log_triage": 100,
    "task_sq_26_api_config_setup": 75,
    "task_sq_27_enviroment_provisioning": 87.5,
    "task_sq_28_e2e_scripting": 100,
    "task_sq_29_bug_diagnosis_and_fix": 87.5,
    "task_sq_30_code_refactoring": 80
  },
  "Doubao-Seed-2.0-pro": {
    "task_sq_01_meeting_coordination": 100,
    "task_sq_02_weather_check": 100,
    "task_sq_03_meeting_summary": 86.67,
    "task_sq_04_interview_invitation": 100,
    "task_sq_05_travel_reimbursement": 100,
    "task_sq_06_onboarding_asset_provisioning": 70,
    "task_sq_07_stock_price_research": 0,
    "task_sq_08_email_retrieval": 99.4,
    "task_sq_09_news_briefing": 100,
    "task_sq_10_report_comprehension": 100,
    "task_sq_11_market_research": 91.5,
    "task_sq_12_long_term_memory_retrieval": 97.5,
    "task_sq_13_blog_writting": 100,
    "task_sq_14_report_summary": 80,
    "task_sq_15_content_transformation": 92,
    "task_sq_16_script_creation": 95.5,
    "task_sq_17_pitch_deck_structuring": 94.44,
    "task_sq_18_content_audit": 87.5,
    "task_sq_19_data_cleaning_etl": 94.5,
    "task_sq_20_data_integration": 96.5,
    "task_sq_21_data_anomaly_detection": 76.94,
    "task_sq_22_visual_reporting": 93.5,
    "task_sq_23_pii_redaction": 82.5,
    "task_sq_24_sales_forecasting": 88.67,
    "task_sq_25_log_triage": 100,
    "task_sq_26_api_config_setup": 75,
    "task_sq_27_enviroment_provisioning": 87.5,
    "task_sq_28_e2e_scripting": 100,
    "task_sq_29_bug_diagnosis_and_fix": 87.5,
    "task_sq_30_code_refactoring": 80
  },
  "ERNIE-5.0-Thinking-Preview": {
    "task_sq_01_meeting_coordination": 100,
    "task_sq_02_weather_check": 100,
    "task_sq_03_meeting_summary": 93.33,
    "task_sq_04_interview_invitation": 100,
    "task_sq_05_travel_reimbursement": 85,
    "task_sq_06_onboarding_asset_provisioning": 70,
    "task_sq_07_stock_price_research": 100,
    "task_sq_08_email_retrieval": 100,
    "task_sq_09_news_briefing": 6,
    "task_sq_10_report_comprehension": 0,
    "task_sq_11_market_research": 0,
    "task_sq_12_long_term_memory_retrieval": 92.5,
    "task_sq_13_blog_writting": 92.5,
    "task_sq_14_report_summary": 4,
    "task_sq_15_content_transformation": 0,
    "task_sq_16_script_creation": 94,
    "task_sq_17_pitch_deck_structuring": 94.44,
    "task_sq_18_content_audit": 98,
    "task_sq_19_data_cleaning_etl": 0,
    "task_sq_20_data_integration": 97,
    "task_sq_21_data_anomaly_detection": 0,
    "task_sq_22_visual_reporting": 0,
    "task_sq_23_pii_redaction": 0,
    "task_sq_24_sales_forecasting": 41.67,
    "task_sq_25_log_triage": 33.33,
    "task_sq_26_api_config_setup": 12.5,
    "task_sq_27_enviroment_provisioning": 12.5,
    "task_sq_28_e2e_scripting": 33.33,
    "task_sq_29_bug_diagnosis_and_fix": 50,
    "task_sq_30_code_refactoring": 20
  },
  "Kimi K2 Thinking": {
    "task_sq_01_meeting_coordination": 100,
    "task_sq_02_weather_check": 100,
    "task_sq_03_meeting_summary": 93.33,
    "task_sq_04_interview_invitation": 100,
    "task_sq_05_travel_reimbursement": 100,
    "task_sq_06_onboarding_asset_provisioning": 70,
    "task_sq_07_stock_price_research": 100,
    "task_sq_08_email_retrieval": 0,
    "task_sq_09_news_briefing": 85.6,
    "task_sq_10_report_comprehension": 100,
    "task_sq_11_market_research": 97.5,
    "task_sq_12_long_term_memory_retrieval": 97.5,
    "task_sq_13_blog_writting": 96,
    "task_sq_14_report_summary": 0,
    "task_sq_15_content_transformation": 12.5,
    "task_sq_16_script_creation": 94,
    "task_sq_17_pitch_deck_structuring": 94.44,
    "task_sq_18_content_audit": 100,
    "task_sq_19_data_cleaning_etl": 100,
    "task_sq_20_data_integration": 100,
    "task_sq_21_data_anomaly_detection": 42.5,
    "task_sq_22_visual_reporting": 90.94,
    "task_sq_23_pii_redaction": 85.88,
    "task_sq_24_sales_forecasting": 85.67,
    "task_sq_25_log_triage": 100,
    "task_sq_26_api_config_setup": 100,
    "task_sq_27_enviroment_provisioning": 62.5,
    "task_sq_28_e2e_scripting": 100,
    "task_sq_29_bug_diagnosis_and_fix": 87.5,
    "task_sq_30_code_refactoring": 80
  },
  "Kimi K2.5": {
    "task_sq_01_meeting_coordination": 100,
    "task_sq_02_weather_check": 100,
    "task_sq_03_meeting_summary": 93.33,
    "task_sq_04_interview_invitation": 100,
    "task_sq_05_travel_reimbursement": 79,
    "task_sq_06_onboarding_asset_provisioning": 70,
    "task_sq_07_stock_price_research": 100,
    "task_sq_08_email_retrieval": 100,
    "task_sq_09_news_briefing": 3.6,
    "task_sq_10_report_comprehension": 100,
    "task_sq_11_market_research": 37.5,
    "task_sq_12_long_term_memory_retrieval": 100,
    "task_sq_13_blog_writting": 75,
    "task_sq_14_report_summary": 20,
    "task_sq_15_content_transformation": 94,
    "task_sq_16_script_creation": 94,
    "task_sq_17_pitch_deck_structuring": 94.44,
    "task_sq_18_content_audit": 91.5,
    "task_sq_19_data_cleaning_etl": 100,
    "task_sq_20_data_integration": 100,
    "task_sq_21_data_anomaly_detection": 27.5,
    "task_sq_22_visual_reporting": 90.69,
    "task_sq_23_pii_redaction": 87.5,
    "task_sq_24_sales_forecasting": 88.54,
    "task_sq_25_log_triage": 100,
    "task_sq_26_api_config_setup": 75,
    "task_sq_27_enviroment_provisioning": 62.5,
    "task_sq_28_e2e_scripting": 100,
    "task_sq_29_bug_diagnosis_and_fix": 87.5,
    "task_sq_30_code_refactoring": 80
  },
  "Qwen3-Coder-Next": {
    "task_sq_01_meeting_coordination": 100,
    "task_sq_02_weather_check": 83.33,
    "task_sq_03_meeting_summary": 86.67,
    "task_sq_04_interview_invitation": 100,
    "task_sq_05_travel_reimbursement": 0,
    "task_sq_06_onboarding_asset_provisioning": 70,
    "task_sq_07_stock_price_research": 100,
    "task_sq_08_email_retrieval": 97,
    "task_sq_09_news_briefing": 85.83,
    "task_sq_10_report_comprehension": 0,
    "task_sq_11_market_research": 50,
    "task_sq_12_long_term_memory_retrieval": 35.5,
    "task_sq_13_blog_writting": 92,
    "task_sq_14_report_summary": 0,
    "task_sq_15_content_transformation": 93,
    "task_sq_16_script_creation": 100,
    "task_sq_17_pitch_deck_structuring": 94.44,
    "task_sq_18_content_audit": 97,
    "task_sq_19_data_cleaning_etl": 50,
    "task_sq_20_data_integration": 50,
    "task_sq_21_data_anomaly_detection": 89,
    "task_sq_22_visual_reporting": 86.94,
    "task_sq_23_pii_redaction": 100,
    "task_sq_24_sales_forecasting": 84.17,
    "task_sq_25_log_triage": 100,
    "task_sq_26_api_config_setup": 100,
    "task_sq_27_enviroment_provisioning": 62.5,
    "task_sq_28_e2e_scripting": 100,
    "task_sq_29_bug_diagnosis_and_fix": 87.5,
    "task_sq_30_code_refactoring": 80
  },
  "Qwen3.5-27B": {
    "task_sq_01_meeting_coordination": 100,
    "task_sq_02_weather_check": 100,
    "task_sq_03_meeting_summary": 86.67,
    "task_sq_04_interview_invitation": 100,
    "task_sq_05_travel_reimbursement": 100,
    "task_sq_06_onboarding_asset_provisioning": 10,
    "task_sq_07_stock_price_research": 100,
    "task_sq_08_email_retrieval": 60,
    "task_sq_09_news_briefing": 9,
    "task_sq_10_report_comprehension": 0,
    "task_sq_11_market_research": 98,
    "task_sq_12_long_term_memory_retrieval": 97.5,
    "task_sq_13_blog_writting": 72,
    "task_sq_14_report_summary": 0,
    "task_sq_15_content_transformation": 96,
    "task_sq_16_script_creation": 0,
    "task_sq_17_pitch_deck_structuring": 92.94,
    "task_sq_18_content_audit": 87.5,
    "task_sq_19_data_cleaning_etl": 100,
    "task_sq_20_data_integration": 96.25,
    "task_sq_21_data_anomaly_detection": 100,
    "task_sq_22_visual_reporting": 72.94,
    "task_sq_23_pii_redaction": 84,
    "task_sq_24_sales_forecasting": 85.42,
    "task_sq_25_log_triage": 88.89,
    "task_sq_26_api_config_setup": 100,
    "task_sq_27_enviroment_provisioning": 62.5,
    "task_sq_28_e2e_scripting": 100,
    "task_sq_29_bug_diagnosis_and_fix": 87.5,
    "task_sq_30_code_refactoring": 70
  },
  "Qwen3.5-35B-A3B": {
    "task_sq_01_meeting_coordination": 100,
    "task_sq_02_weather_check": 100,
    "task_sq_03_meeting_summary": 93.33,
    "task_sq_04_interview_invitation": 100,
    "task_sq_05_travel_reimbursement": 100,
    "task_sq_06_onboarding_asset_provisioning": 70,
    "task_sq_07_stock_price_research": 100,
    "task_sq_08_email_retrieval": 100,
    "task_sq_09_news_briefing": 91.83,
    "task_sq_10_report_comprehension": 100,
    "task_sq_11_market_research": 94,
    "task_sq_12_long_term_memory_retrieval": 91.5,
    "task_sq_13_blog_writting": 76,
    "task_sq_14_report_summary": 85,
    "task_sq_15_content_transformation": 92,
    "task_sq_16_script_creation": 93,
    "task_sq_17_pitch_deck_structuring": 94.44,
    "task_sq_18_content_audit": 93.44,
    "task_sq_19_data_cleaning_etl": 91.43,
    "task_sq_20_data_integration": 100,
    "task_sq_21_data_anomaly_detection": 87.25,
    "task_sq_22_visual_reporting": 57.78,
    "task_sq_23_pii_redaction": 91.5,
    "task_sq_24_sales_forecasting": 85.67,
    "task_sq_25_log_triage": 100,
    "task_sq_26_api_config_setup": 100,
    "task_sq_27_enviroment_provisioning": 87.5,
    "task_sq_28_e2e_scripting": 100,
    "task_sq_29_bug_diagnosis_and_fix": 87.5,
    "task_sq_30_code_refactoring": 80
  },
  "Qwen3.5-122B-A10B": {
    "task_sq_01_meeting_coordination": 100,
    "task_sq_02_weather_check": 100,
    "task_sq_03_meeting_summary": 93.33,
    "task_sq_04_interview_invitation": 100,
    "task_sq_05_travel_reimbursement": 0,
    "task_sq_06_onboarding_asset_provisioning": 70,
    "task_sq_07_stock_price_research": 0,
    "task_sq_08_email_retrieval": 99.4,
    "task_sq_09_news_briefing": 86.43,
    "task_sq_10_report_comprehension": 100,
    "task_sq_11_market_research": 98.5,
    "task_sq_12_long_term_memory_retrieval": 100,
    "task_sq_13_blog_writting": 100,
    "task_sq_14_report_summary": 93,
    "task_sq_15_content_transformation": 99,
    "task_sq_16_script_creation": 97.5,
    "task_sq_17_pitch_deck_structuring": 94.44,
    "task_sq_18_content_audit": 93.5,
    "task_sq_19_data_cleaning_etl": 100,
    "task_sq_20_data_integration": 96.25,
    "task_sq_21_data_anomaly_detection": 80.44,
    "task_sq_22_visual_reporting": 91.44,
    "task_sq_23_pii_redaction": 82.37,
    "task_sq_24_sales_forecasting": 88.67,
    "task_sq_25_log_triage": 100,
    "task_sq_26_api_config_setup": 75,
    "task_sq_27_enviroment_provisioning": 62.5,
    "task_sq_28_e2e_scripting": 100,
    "task_sq_29_bug_diagnosis_and_fix": 87.5,
    "task_sq_30_code_refactoring": 90
  },
  "Qwen3.5-397B-A17B": {
    "task_sq_01_meeting_coordination": 100,
    "task_sq_02_weather_check": 100,
    "task_sq_03_meeting_summary": 93.33,
    "task_sq_04_interview_invitation": 100,
    "task_sq_05_travel_reimbursement": 100,
    "task_sq_06_onboarding_asset_provisioning": 70,
    "task_sq_07_stock_price_research": 100,
    "task_sq_08_email_retrieval": 100,
    "task_sq_09_news_briefing": 86.73,
    "task_sq_10_report_comprehension": 100,
    "task_sq_11_market_research": 100,
    "task_sq_12_long_term_memory_retrieval": 94,
    "task_sq_13_blog_writting": 96,
    "task_sq_14_report_summary": 100,
    "task_sq_15_content_transformation": 100,
    "task_sq_16_script_creation": 100,
    "task_sq_17_pitch_deck_structuring": 94.44,
    "task_sq_18_content_audit": 95,
    "task_sq_19_data_cleaning_etl": 96.25,
    "task_sq_20_data_integration": 50,
    "task_sq_21_data_anomaly_detection": 90.44,
    "task_sq_22_visual_reporting": 50,
    "task_sq_23_pii_redaction": 89,
    "task_sq_24_sales_forecasting": 88.67,
    "task_sq_25_log_triage": 100,
    "task_sq_26_api_config_setup": 75,
    "task_sq_27_enviroment_provisioning": 62.5,
    "task_sq_28_e2e_scripting": 100,
    "task_sq_29_bug_diagnosis_and_fix": 87.5,
    "task_sq_30_code_refactoring": 80
  },
  "Qwen3.5-Plus-2026-02-15": {
    "task_sq_01_meeting_coordination": 100,
    "task_sq_02_weather_check": 100,
    "task_sq_03_meeting_summary": 86.67,
    "task_sq_04_interview_invitation": 100,
    "task_sq_05_travel_reimbursement": 100,
    "task_sq_06_onboarding_asset_provisioning": 70,
    "task_sq_07_stock_price_research": 0,
    "task_sq_08_email_retrieval": 100,
    "task_sq_09_news_briefing": 86.43,
    "task_sq_10_report_comprehension": 100,
    "task_sq_11_market_research": 100,
    "task_sq_12_long_term_memory_retrieval": 95,
    "task_sq_13_blog_writting": 100,
    "task_sq_14_report_summary": 100,
    "task_sq_15_content_transformation": 95,
    "task_sq_16_script_creation": 99,
    "task_sq_17_pitch_deck_structuring": 94.44,
    "task_sq_18_content_audit": 91.44,
    "task_sq_19_data_cleaning_etl": 93.5,
    "task_sq_20_data_integration": 100,
    "task_sq_21_data_anomaly_detection": 38.5,
    "task_sq_22_visual_reporting": 98.5,
    "task_sq_23_pii_redaction": 85.42,
    "task_sq_24_sales_forecasting": 88.67,
    "task_sq_25_log_triage": 100,
    "task_sq_26_api_config_setup": 75,
    "task_sq_27_enviroment_provisioning": 87.5,
    "task_sq_28_e2e_scripting": 100,
    "task_sq_29_bug_diagnosis_and_fix": 87.5,
    "task_sq_30_code_refactoring": 80
  },
  "DeepSeek-V3.2(Non-thinking)": {
    "task_sq_01_meeting_coordination": 100, "task_sq_02_weather_check": 100, "task_sq_03_meeting_summary": 93.33, "task_sq_04_interview_invitation": 97.5, "task_sq_05_travel_reimbursement": 85, "task_sq_06_onboarding_asset_provisioning": 70, "task_sq_07_stock_price_research": 0, "task_sq_08_email_retrieval": 100, "task_sq_09_news_briefing": 92.5, "task_sq_10_report_comprehension": 0, "task_sq_11_market_research": 97.5, "task_sq_12_long_term_memory_retrieval": 97.5, "task_sq_13_blog_writting": 91, "task_sq_14_report_summary": 69, "task_sq_15_content_transformation": 100, "task_sq_16_script_creation": 97, "task_sq_17_pitch_deck_structuring": 44.44, "task_sq_18_content_audit": 91, "task_sq_19_data_cleaning_etl": 100, "task_sq_20_data_integration": 96.5, "task_sq_21_data_anomaly_detection": 18, "task_sq_22_visual_reporting": 0, "task_sq_23_pii_redaction": 87.5, "task_sq_24_sales_forecasting": 88.67, "task_sq_25_log_triage": 100, "task_sq_26_api_config_setup": 100, "task_sq_27_enviroment_provisioning": 87.5, "task_sq_28_e2e_scripting": 100, "task_sq_29_bug_diagnosis_and_fix": 87.5, "task_sq_30_code_refactoring": 80
  },
  "DeepSeek-V3.2(Thinking)": {
    "task_sq_01_meeting_coordination": 100, "task_sq_02_weather_check": 100, "task_sq_03_meeting_summary": 83.67, "task_sq_04_interview_invitation": 77.5, "task_sq_05_travel_reimbursement": 100, "task_sq_06_onboarding_asset_provisioning": 70, "task_sq_07_stock_price_research": 100, "task_sq_08_email_retrieval": 100, "task_sq_09_news_briefing": 100, "task_sq_10_report_comprehension": 0, "task_sq_11_market_research": 0, "task_sq_12_long_term_memory_retrieval": 17.5, "task_sq_13_blog_writting": 88, "task_sq_14_report_summary": 87, "task_sq_15_content_transformation": 100, "task_sq_16_script_creation": 97, "task_sq_17_pitch_deck_structuring": 94.44, "task_sq_18_content_audit": 93.5, "task_sq_19_data_cleaning_etl": 100, "task_sq_20_data_integration": 8.33, "task_sq_21_data_anomaly_detection": 5, "task_sq_22_visual_reporting": 94, "task_sq_23_pii_redaction": 87.5, "task_sq_24_sales_forecasting": 88.67, "task_sq_25_log_triage": 100, "task_sq_26_api_config_setup": 12.5, "task_sq_27_enviroment_provisioning": 12.5, "task_sq_28_e2e_scripting": 33.33, "task_sq_29_bug_diagnosis_and_fix": 87.5, "task_sq_30_code_refactoring": 80
  },
  "GLM-5": {
    "task_sq_01_meeting_coordination": 100, "task_sq_02_weather_check": 100, "task_sq_03_meeting_summary": 93.33, "task_sq_04_interview_invitation": 100, "task_sq_05_travel_reimbursement": 85, "task_sq_06_onboarding_asset_provisioning": 70, "task_sq_07_stock_price_research": 100, "task_sq_08_email_retrieval": 97.6, "task_sq_09_news_briefing": 93.33, "task_sq_10_report_comprehension": 71.43, "task_sq_11_market_research": 100, "task_sq_12_long_term_memory_retrieval": 99, "task_sq_13_blog_writting": 92, "task_sq_14_report_summary": 100, "task_sq_15_content_transformation": 95, "task_sq_16_script_creation": 95.5, "task_sq_17_pitch_deck_structuring": 94.44, "task_sq_18_content_audit": 80, "task_sq_19_data_cleaning_etl": 100, "task_sq_20_data_integration": 100, "task_sq_21_data_anomaly_detection": 95, "task_sq_22_visual_reporting": 100, "task_sq_23_pii_redaction": 91.25, "task_sq_24_sales_forecasting": 91.67, "task_sq_25_log_triage": 100, "task_sq_26_api_config_setup": 75, "task_sq_27_enviroment_provisioning": 62.5, "task_sq_28_e2e_scripting": 100, "task_sq_29_bug_diagnosis_and_fix": 87.5, "task_sq_30_code_refactoring": 80
  },
  "MiMo-V2-Flash": {
    "task_sq_01_meeting_coordination": 100, "task_sq_02_weather_check": 100, "task_sq_03_meeting_summary": 0, "task_sq_04_interview_invitation": 99.5, "task_sq_05_travel_reimbursement": 45, "task_sq_06_onboarding_asset_provisioning": 70, "task_sq_07_stock_price_research": 100, "task_sq_08_email_retrieval": 100, "task_sq_09_news_briefing": 100, "task_sq_10_report_comprehension": 100, "task_sq_11_market_research": 90.5, "task_sq_12_long_term_memory_retrieval": 87.5, "task_sq_13_blog_writting": 96, "task_sq_14_report_summary": 75, "task_sq_15_content_transformation": 91, "task_sq_16_script_creation": 95, "task_sq_17_pitch_deck_structuring": 94.44, "task_sq_18_content_audit": 100, "task_sq_19_data_cleaning_etl": 96.5, "task_sq_20_data_integration": 96.25, "task_sq_21_data_anomaly_detection": 78.19, "task_sq_22_visual_reporting": 84.94, "task_sq_23_pii_redaction": 50, "task_sq_24_sales_forecasting": 88.67, "task_sq_25_log_triage": 100, "task_sq_26_api_config_setup": 100, "task_sq_27_enviroment_provisioning": 62.5, "task_sq_28_e2e_scripting": 100, "task_sq_29_bug_diagnosis_and_fix": 87.5, "task_sq_30_code_refactoring": 80
  },
  "MiMo-V2-Omni": {
    "task_sq_01_meeting_coordination": 100, "task_sq_02_weather_check": 100, "task_sq_03_meeting_summary": 93.33, "task_sq_04_interview_invitation": 100, "task_sq_05_travel_reimbursement": 96.8, "task_sq_06_onboarding_asset_provisioning": 70, "task_sq_07_stock_price_research": 100, "task_sq_08_email_retrieval": 100, "task_sq_09_news_briefing": 89.58, "task_sq_10_report_comprehension": 100, "task_sq_11_market_research": 97.5, "task_sq_12_long_term_memory_retrieval": 89.5, "task_sq_13_blog_writting": 76, "task_sq_14_report_summary": 97, "task_sq_15_content_transformation": 82, "task_sq_16_script_creation": 97.5, "task_sq_17_pitch_deck_structuring": 94.44, "task_sq_18_content_audit": 96.5, "task_sq_19_data_cleaning_etl": 93.5, "task_sq_20_data_integration": 96.5, "task_sq_21_data_anomaly_detection": 85.94, "task_sq_22_visual_reporting": 98.5, "task_sq_23_pii_redaction": 90, "task_sq_24_sales_forecasting": 85.42, "task_sq_25_log_triage": 100, "task_sq_26_api_config_setup": 75, "task_sq_27_enviroment_provisioning": 62.5, "task_sq_28_e2e_scripting": 100, "task_sq_29_bug_diagnosis_and_fix": 87.5, "task_sq_30_code_refactoring": 80
  },
  "MiMo-V2-Pro": {
    "task_sq_01_meeting_coordination": 100, "task_sq_02_weather_check": 100, "task_sq_03_meeting_summary": 93.33, "task_sq_04_interview_invitation": 100, "task_sq_05_travel_reimbursement": 100, "task_sq_06_onboarding_asset_provisioning": 70, "task_sq_07_stock_price_research": 0, "task_sq_08_email_retrieval": 100, "task_sq_09_news_briefing": 89.73, "task_sq_10_report_comprehension": 100, "task_sq_11_market_research": 100, "task_sq_12_long_term_memory_retrieval": 95, "task_sq_13_blog_writting": 88, "task_sq_14_report_summary": 92, "task_sq_15_content_transformation": 100, "task_sq_16_script_creation": 98.5, "task_sq_17_pitch_deck_structuring": 94.44, "task_sq_18_content_audit": 96, "task_sq_19_data_cleaning_etl": 96.25, "task_sq_20_data_integration": 96.5, "task_sq_21_data_anomaly_detection": 90.94, "task_sq_22_visual_reporting": 97, "task_sq_23_pii_redaction": 87.5, "task_sq_24_sales_forecasting": 89.67, "task_sq_25_log_triage": 100, "task_sq_26_api_config_setup": 75, "task_sq_27_enviroment_provisioning": 62.5, "task_sq_28_e2e_scripting": 100, "task_sq_29_bug_diagnosis_and_fix": 87.5, "task_sq_30_code_refactoring": 80
  },
  "MiniMax-M2.5": {
    "task_sq_01_meeting_coordination": 100, "task_sq_02_weather_check": 100, "task_sq_03_meeting_summary": 93.33, "task_sq_04_interview_invitation": 93, "task_sq_05_travel_reimbursement": 100, "task_sq_06_onboarding_asset_provisioning": 70, "task_sq_07_stock_price_research": 100, "task_sq_08_email_retrieval": 98.2, "task_sq_09_news_briefing": 92.5, "task_sq_10_report_comprehension": 100, "task_sq_11_market_research": 92.5, "task_sq_12_long_term_memory_retrieval": 100, "task_sq_13_blog_writting": 89, "task_sq_14_report_summary": 95, "task_sq_15_content_transformation": 86, "task_sq_16_script_creation": 93.5, "task_sq_17_pitch_deck_structuring": 94.44, "task_sq_18_content_audit": 97.5, "task_sq_19_data_cleaning_etl": 90.5, "task_sq_20_data_integration": 98, "task_sq_21_data_anomaly_detection": 92, "task_sq_22_visual_reporting": 92.94, "task_sq_23_pii_redaction": 86, "task_sq_24_sales_forecasting": 88.67, "task_sq_25_log_triage": 88.89, "task_sq_26_api_config_setup": 100, "task_sq_27_enviroment_provisioning": 62.5, "task_sq_28_e2e_scripting": 100, "task_sq_29_bug_diagnosis_and_fix": 87.5, "task_sq_30_code_refactoring": 80
  },
  "MiniMax-M2.7": {
    "task_sq_01_meeting_coordination": 100, "task_sq_02_weather_check": 100, "task_sq_03_meeting_summary": 93.33, "task_sq_04_interview_invitation": 100, "task_sq_05_travel_reimbursement": 100, "task_sq_06_onboarding_asset_provisioning": 70, "task_sq_07_stock_price_research": 100, "task_sq_08_email_retrieval": 100, "task_sq_09_news_briefing": 79.83, "task_sq_10_report_comprehension": 100, "task_sq_11_market_research": 97, "task_sq_12_long_term_memory_retrieval": 85, "task_sq_13_blog_writting": 100, "task_sq_14_report_summary": 98, "task_sq_15_content_transformation": 92, "task_sq_16_script_creation": 98, "task_sq_17_pitch_deck_structuring": 94.44, "task_sq_18_content_audit": 90, "task_sq_19_data_cleaning_etl": 91.25, "task_sq_20_data_integration": 94, "task_sq_21_data_anomaly_detection": 91.94, "task_sq_22_visual_reporting": 96.5, "task_sq_23_pii_redaction": 87.5, "task_sq_24_sales_forecasting": 88.54, "task_sq_25_log_triage": 100, "task_sq_26_api_config_setup": 75, "task_sq_27_enviroment_provisioning": 62.5, "task_sq_28_e2e_scripting": 100, "task_sq_29_bug_diagnosis_and_fix": 87.5, "task_sq_30_code_refactoring": 80
  },
  "Step 3.5 Flash": {
    "task_sq_01_meeting_coordination": 100, "task_sq_02_weather_check": 100, "task_sq_03_meeting_summary": 93.33, "task_sq_04_interview_invitation": 100, "task_sq_05_travel_reimbursement": 85, "task_sq_06_onboarding_asset_provisioning": 70, "task_sq_07_stock_price_research": 0, "task_sq_08_email_retrieval": 98.8, "task_sq_09_news_briefing": 18.6, "task_sq_10_report_comprehension": 100, "task_sq_11_market_research": 97, "task_sq_12_long_term_memory_retrieval": 97.5, "task_sq_13_blog_writting": 90, "task_sq_14_report_summary": 94.5, "task_sq_15_content_transformation": 90, "task_sq_16_script_creation": 95, "task_sq_17_pitch_deck_structuring": 88.89, "task_sq_18_content_audit": 95.5, "task_sq_19_data_cleaning_etl": 96.25, "task_sq_20_data_integration": 100, "task_sq_21_data_anomaly_detection": 95, "task_sq_22_visual_reporting": 100, "task_sq_23_pii_redaction": 87.5, "task_sq_24_sales_forecasting": 85.42, "task_sq_25_log_triage": 100, "task_sq_26_api_config_setup": 75, "task_sq_27_enviroment_provisioning": 87.5, "task_sq_28_e2e_scripting": 100, "task_sq_29_bug_diagnosis_and_fix": 87.5, "task_sq_30_code_refactoring": 20
  }
};


const SPECIAL_MODEL_CATEGORY_SCORES: Record<string, Record<string, number>> = {
  "Doubao-Seed-2.0-lite": {
    "Office Collaboration": 92.78,
    "Information Retrieval and Research": 96.85,
    "Content Creation": 94.41,
    "Data Processing and Analysis": 93.07,
    "Software Engineering": 88.33
  },
  "Doubao-Seed-2.0-pro": {
    "Office Collaboration": 92.78,
    "Information Retrieval and Research": 81.4,
    "Content Creation": 91.57,
    "Data Processing and Analysis": 88.77,
    "Software Engineering": 88.33
  },
  "ERNIE-5.0-Thinking-Preview": {
    "Office Collaboration": 91.39,
    "Information Retrieval and Research": 49.75,
    "Content Creation": 63.82,
    "Data Processing and Analysis": 23.11,
    "Software Engineering": 26.94
  },
  "Kimi K2 Thinking": {
    "Office Collaboration": 93.89,
    "Information Retrieval and Research": 80.1,
    "Content Creation": 66.16,
    "Data Processing and Analysis": 84.17,
    "Software Engineering": 88.33
  },
  "Kimi K2.5": {
    "Office Collaboration": 90.39,
    "Information Retrieval and Research": 73.52,
    "Content Creation": 78.16,
    "Data Processing and Analysis": 82.37,
    "Software Engineering": 84.17
  },
  "Qwen3-Coder-Next": {
    "Office Collaboration": 73.33,
    "Information Retrieval and Research": 61.39,
    "Content Creation": 79.41,
    "Data Processing and Analysis": 76.69,
    "Software Engineering": 88.33
  },
  "Qwen3.5-27B": {
    "Office Collaboration": 82.78,
    "Information Retrieval and Research": 60.75,
    "Content Creation": 58.07,
    "Data Processing and Analysis": 89.77,
    "Software Engineering": 84.81
  },
  "Qwen3.5-35B-A3B": {
    "Office Collaboration": 93.89,
    "Information Retrieval and Research": 96.22,
    "Content Creation": 88.98,
    "Data Processing and Analysis": 85.61,
    "Software Engineering": 92.5
  },
  "Qwen3.5-122B-A10B": {
    "Office Collaboration": 77.22,
    "Information Retrieval and Research": 80.72,
    "Content Creation": 96.24,
    "Data Processing and Analysis": 89.86,
    "Software Engineering": 85.83
  },
  "Qwen3.5-397B-A17B": {
    "Office Collaboration": 93.89,
    "Information Retrieval and Research": 96.79,
    "Content Creation": 97.57,
    "Data Processing and Analysis": 77.39,
    "Software Engineering": 84.17
  },
  "Qwen3.5-Plus-2026-02-15": {
    "Office Collaboration": 92.78,
    "Information Retrieval and Research": 80.24,
    "Content Creation": 96.65,
    "Data Processing and Analysis": 84.1,
    "Software Engineering": 88.33
  },
  "DeepSeek-V3.2(Non-thinking)": {
    "Office Collaboration": 90.97, "Information Retrieval and Research": 64.58, "Content Creation": 82.07, "Data Processing and Analysis": 65.11, "Software Engineering": 92.5
  },
  "DeepSeek-V3.2(Thinking)": {
    "Office Collaboration": 88.53, "Information Retrieval and Research": 52.92, "Content Creation": 93.32, "Data Processing and Analysis": 63.92, "Software Engineering": 54.3
  },
  "GLM-5": {
    "Office Collaboration": 91.39, "Information Retrieval and Research": 93.56, "Content Creation": 92.82, "Data Processing and Analysis": 96.32, "Software Engineering": 84.17
  },
  "MiMo-V2-Flash": {
    "Office Collaboration": 69.08, "Information Retrieval and Research": 96.33, "Content Creation": 91.91, "Data Processing and Analysis": 82.42, "Software Engineering": 88.33
  },
  "MiMo-V2-Omni": {
    "Office Collaboration": 93.36, "Information Retrieval and Research": 96.1, "Content Creation": 90.57, "Data Processing and Analysis": 91.64, "Software Engineering": 84.17
  },
  "MiMo-V2-Pro": {
    "Office Collaboration": 93.89, "Information Retrieval and Research": 80.79, "Content Creation": 94.82, "Data Processing and Analysis": 92.98, "Software Engineering": 84.17
  },
  "MiniMax-M2.5": {
    "Office Collaboration": 92.72, "Information Retrieval and Research": 97.2, "Content Creation": 92.57, "Data Processing and Analysis": 91.35, "Software Engineering": 86.48
  },
  "MiniMax-M2.7": {
    "Office Collaboration": 93.89, "Information Retrieval and Research": 93.64, "Content Creation": 95.41, "Data Processing and Analysis": 91.62, "Software Engineering": 84.17
  },
  "Step 3.5 Flash": {
    "Office Collaboration": 91.39, "Information Retrieval and Research": 68.65, "Content Creation": 92.31, "Data Processing and Analysis": 94.03, "Software Engineering": 78.33
  }
};


export function getModelDetail(modelName: string, provider: string, successRate: number): ModelDetailData {
  const modelData = benchmarkData.find(m => m.model === modelName);
  
  // Generate deterministic mock data based on model name
  const seed = modelName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const random = (s: number) => {
    const x = Math.sin(s) * 10000;
    return x - Math.floor(x);
  };

  const totalTasks = 30;
  const maxPoints = 30.0;
  const overallScore = successRate;
  const totalPoints = (successRate / 100) * maxPoints;

  const categories: CategoryScore[] = CATEGORIES.map((cat, i) => {
    const specialCatScores = SPECIAL_MODEL_CATEGORY_SCORES[modelName];
    if (specialCatScores && specialCatScores[cat]) {
      return {
        name: cat,
        score: specialCatScores[cat],
        maxScore: 1.0,
        taskCount: TASKS.filter(t => t.category === cat).length
      };
    }

    const catSeed = seed + i;
    const scoreBase = (successRate / 100) + (random(catSeed) * 0.2 - 0.1);
    const score = Math.max(0, Math.min(1, scoreBase));
    return {
      name: cat,
      score: Math.round(score * 100),
      maxScore: 1.0,
      taskCount: 1 + Math.floor(random(catSeed + 100) * 3)
    };
  });

  const tasks: TaskResult[] = TASKS.map((taskDef, i) => {
    const specialTaskScores = SPECIAL_MODEL_TASK_SCORES[modelName];
    let score: number;
    
    if (specialTaskScores && specialTaskScores[taskDef.id] !== undefined) {
      score = specialTaskScores[taskDef.id] / 100;
    } else {
      const taskSeed = seed + i + 500;
      const scoreBase = (successRate / 100) + (random(taskSeed) * 0.4 - 0.2);
      score = Math.max(0, Math.min(1, scoreBase));
    }

    const taskSeed = seed + i + 500;

    const criteriaNames = [
      "File Created", "Attendee Present", "Title Correct", "Description Present", 
      "Time Correct", "Date Correct", "Format Valid", "Content Accurate",
      "Logic Sound", "Safety Check", "Efficiency", "Clarity"
    ];
    const numCriteria = 4 + Math.floor(random(taskSeed + 300) * 4);
    const criteria = Array.from({ length: numCriteria }).map((_, j) => {
      const critSeed = taskSeed + j + 1000;
      const critScore = Math.max(0, Math.min(1, score + (random(critSeed) * 0.2 - 0.1)));
      return {
        name: criteriaNames[(i + j) % criteriaNames.length],
        score: critScore
      };
    });

    return {
      id: taskDef.id,
      name: taskDef.name,
      category: taskDef.category,
      method: taskDef.method,
      score: score,
      maxScore: 1.0,
      criteria
    };
  });

  return {
    model: modelName,
    provider,
    type: modelData?.type || 'proprietary',
    logo: modelData?.logo,
    bestTime: modelData?.bestTime,
    bestCost: modelData?.bestCost,
    valueScore: modelData?.valueScore,
    overallScore,
    totalPoints,
    maxPoints,
    submissionTime: "Submitted about 10 hours ago",
    runInfo: "Run 2 of 14",
    openClawVersion: "OpenClaw 2026.3.13 (61d171a)",
    benchmarkVersion: "262c418",
    submissionId: `7d0bf109-bd76-4c0a-822a-${seed.toString(16).padStart(8, '0')}`,
    categories,
    tasks,
    hardware: {
      cpu: "Intel Core Processor (Haswell, no TSX, IBRS) (2 cores)",
      memory: "8 GB",
      architecture: "x86_64",
      os: "linux 5.15.0-171-generic"
    }
  };
}
