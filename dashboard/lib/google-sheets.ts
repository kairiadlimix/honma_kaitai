import { google } from 'googleapis';

// Google Sheets APIクライアントの初期化
export async function getGoogleSheetsClient() {
  // サービスアカウントキーまたはOAuth2を使用
  // PoC段階では、環境変数から認証情報を取得
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });

  const sheets = google.sheets({ version: 'v4', auth });
  return sheets;
}

// Google Sheetsからデータを取得
export async function getSheetData(spreadsheetId: string, range: string) {
  try {
    const sheets = await getGoogleSheetsClient();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    return response.data.values || [];
  } catch (error) {
    console.error('Error fetching sheet data:', error);
    throw error;
  }
}

// 重機マスタデータを取得
export async function getMachinesData() {
  const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
  if (!spreadsheetId) {
    throw new Error('GOOGLE_SHEETS_ID is not set');
  }
  return getSheetData(spreadsheetId, '重機マスタ!A2:J');
}

// 稼働時間データを取得
export async function getOperationHoursData() {
  const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
  if (!spreadsheetId) {
    throw new Error('GOOGLE_SHEETS_ID is not set');
  }
  return getSheetData(spreadsheetId, '稼働時間!A2:E');
}

// メンテナンスデータを取得
export async function getMaintenanceData() {
  const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
  if (!spreadsheetId) {
    throw new Error('GOOGLE_SHEETS_ID is not set');
  }
  return getSheetData(spreadsheetId, 'メンテナンス!A2:H');
}

// 消耗品データを取得
export async function getConsumablesData() {
  const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
  if (!spreadsheetId) {
    throw new Error('GOOGLE_SHEETS_ID is not set');
  }
  return getSheetData(spreadsheetId, '消耗品!A2:I');
}

