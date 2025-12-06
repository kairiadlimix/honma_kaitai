/**
 * Google Sheetsにサンプルデータを投入するスクリプト
 * 
 * 使用方法:
 * 1. .env.localにGoogle Sheetsの認証情報を設定
 * 2. tsx scripts/setup-google-sheets.ts を実行
 */

import { google } from 'googleapis';
import { sampleMachines, sampleOperationHours, sampleMaintenances, sampleConsumables } from './sample-data';

async function setupGoogleSheets() {
  // 環境変数の確認
  const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
  const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!spreadsheetId || !serviceAccountEmail || !privateKey) {
    console.error('❌ 環境変数が設定されていません');
    console.error('以下の環境変数を設定してください:');
    console.error('- GOOGLE_SHEETS_ID');
    console.error('- GOOGLE_SERVICE_ACCOUNT_EMAIL');
    console.error('- GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY');
    process.exit(1);
  }

  // Google Sheets APIクライアントの初期化
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: serviceAccountEmail,
      private_key: privateKey,
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });

  try {
    console.log('📊 Google Sheetsにサンプルデータを投入中...\n');

    // 1. 重機マスタデータの投入
    console.log('1. 重機マスタデータを投入中...');
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: '重機マスタ!A1',
      valueInputOption: 'RAW',
      requestBody: {
        values: sampleMachines,
      },
    });
    console.log(`   ✅ ${sampleMachines.length - 1}件の重機データを投入しました`);

    // 2. 稼働時間データの投入
    console.log('2. 稼働時間データを投入中...');
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: '稼働時間!A1',
      valueInputOption: 'RAW',
      requestBody: {
        values: sampleOperationHours,
      },
    });
    console.log(`   ✅ ${sampleOperationHours.length - 1}件の稼働時間データを投入しました`);

    // 3. メンテナンスデータの投入
    console.log('3. メンテナンスデータを投入中...');
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: 'メンテナンス!A1',
      valueInputOption: 'RAW',
      requestBody: {
        values: sampleMaintenances,
      },
    });
    console.log(`   ✅ ${sampleMaintenances.length - 1}件のメンテナンスデータを投入しました`);

    // 4. 消耗品データの投入
    console.log('4. 消耗品データを投入中...');
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: '消耗品!A1',
      valueInputOption: 'RAW',
      requestBody: {
        values: sampleConsumables,
      },
    });
    console.log(`   ✅ ${sampleConsumables.length - 1}件の消耗品データを投入しました`);

    console.log('\n✨ サンプルデータの投入が完了しました！');
    console.log(`📋 スプレッドシート: https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`);

  } catch (error: any) {
    console.error('❌ エラーが発生しました:', error.message);
    if (error.code === 404) {
      console.error('   スプレッドシートが見つかりません。GOOGLE_SHEETS_IDを確認してください。');
    } else if (error.code === 403) {
      console.error('   アクセス権限がありません。サービスアカウントにスプレッドシートの共有権限を付与してください。');
    }
    process.exit(1);
  }
}

// スクリプト実行
setupGoogleSheets();

