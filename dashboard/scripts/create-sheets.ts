/**
 * Google Sheetsを新規作成してサンプルデータを投入するスクリプト
 * 
 * 使用方法:
 * 1. .env.localにGoogle Sheetsの認証情報を設定
 * 2. tsx scripts/create-sheets.ts を実行
 */

import { google } from 'googleapis';
import { sampleMachines, sampleOperationHours, sampleMaintenances, sampleConsumables } from './sample-data';

async function createGoogleSheets() {
  const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!serviceAccountEmail || !privateKey) {
    console.error('❌ 環境変数が設定されていません');
    console.error('以下の環境変数を設定してください:');
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
    scopes: [
      'https://www.googleapis.com/auth/spreadsheets',
      'https://www.googleapis.com/auth/drive',
    ],
  });

  const sheets = google.sheets({ version: 'v4', auth });
  const drive = google.drive({ version: 'v3', auth });

  try {
    console.log('📊 新しいGoogle Sheetsを作成中...\n');

    // 1. スプレッドシートを作成
    const spreadsheet = await sheets.spreadsheets.create({
      requestBody: {
        properties: {
          title: '重機稼働予測ダッシュボード - サンプルデータ',
        },
      },
    });

    const spreadsheetId = spreadsheet.data.spreadsheetId;
    if (!spreadsheetId) {
      throw new Error('スプレッドシートIDが取得できませんでした');
    }

    console.log(`✅ スプレッドシートを作成しました: ${spreadsheetId}`);

    // 2. デフォルトシートを削除
    const defaultSheetId = spreadsheet.data.sheets?.[0]?.properties?.sheetId;
    if (defaultSheetId !== undefined) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [
            {
              deleteSheet: {
                sheetId: defaultSheetId,
              },
            },
          ],
        },
      });
    }

    // 3. 必要なシートを作成
    console.log('📋 シートを作成中...');
    const sheetNames = ['重機マスタ', '稼働時間', 'メンテナンス', '消耗品'];
    
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: sheetNames.map((name) => ({
          addSheet: {
            properties: {
              title: name,
            },
          },
        })),
      },
    });

    console.log('   ✅ シートを作成しました');

    // 4. サンプルデータを投入
    console.log('\n📊 サンプルデータを投入中...\n');

    // 重機マスタ
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

    // 稼働時間
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

    // メンテナンス
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

    // 消耗品
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

    // 5. スプレッドシートを共有（サービスアカウントに編集権限を付与）
    await drive.permissions.create({
      fileId: spreadsheetId,
      requestBody: {
        role: 'writer',
        type: 'user',
        emailAddress: serviceAccountEmail,
      },
    });

    console.log('\n✨ セットアップが完了しました！\n');
    console.log('📋 スプレッドシートURL:');
    console.log(`   https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit\n`);
    console.log('📝 .env.localに以下を追加してください:');
    console.log(`   GOOGLE_SHEETS_ID="${spreadsheetId}"\n`);

  } catch (error: any) {
    console.error('❌ エラーが発生しました:', error.message);
    if (error.code === 403) {
      console.error('   アクセス権限がありません。サービスアカウントに適切な権限を付与してください。');
    }
    process.exit(1);
  }
}

// スクリプト実行
createGoogleSheets();

