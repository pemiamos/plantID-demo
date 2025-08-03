import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Image, Spin, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import axios from 'axios';

function PlantIdentifier() {
  const [imageUrl, setImageUrl] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async ({ file }) => {
    setLoading(true);

    const toBase64 = file =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = error => reject(error);
      });

    try {
      const base64Image = await toBase64(file);
      const response = await axios.post(
        'https://api.plant.id/v2/identify',
        {
          images: [base64Image],
          organs: ['leaf'],
          details: [
            "common_names",
            "url",
            "name_authority",
            "wiki_description",
            "taxonomy",
            "synonyms"
          ]
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Api-Key': 'XCYFzewGYhsOqYewjCPSoKZIWAmrQZoCvc6ul7zlmhf9wgqvnC',
          },
        }
      );
      const suggestion = response.data?.suggestions?.[0];
      const plantName = suggestion?.plant_name || '';
      const commonNames = suggestion?.plant_details?.common_names || [];
      const enName = commonNames.find(n => /^[A-Za-z\s\-]+$/.test(n));
      const zhName = commonNames.find(n => /[\u4e00-\u9fa5]/.test(n));

      // 查询 Wikipedia 百科内容（优先中文，无则英文）
      let wikiSummary = '暂无百科简介';
      let wikiLink = '';
      if (plantName) {
        wikiLink = `https://en.wikipedia.org/wiki/${encodeURIComponent(plantName)}`;
        try {
          const zhWiki = await axios.get(
            `https://zh.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(plantName)}`
          );
          if (zhWiki.data?.extract) {
            wikiSummary = zhWiki.data.extract;
          } else {
            const enWiki = await axios.get(
              `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(plantName)}`
            );
            if (enWiki.data?.extract) {
              wikiSummary = enWiki.data.extract;
            }
          }
        } catch (e) {
          try {
            const enWiki = await axios.get(
              `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(plantName)}`
            );
            if (enWiki.data?.extract) {
              wikiSummary = enWiki.data.extract;
            }
          } catch (e2) {
            // 保持暂无百科简介
          }
        }
      }

      // 组合简介内容
      let intro = '';
      if (enName) intro += `英文名：${enName}\n`;
      if (zhName) intro += `中文名：${zhName}\n`;
      intro += `百科：${wikiSummary}\n`;
      if (wikiLink) intro += `更多信息：<a href="${wikiLink}" target="_blank">${wikiLink}</a>`;

      setResult({
        name: plantName || '未识别到植物',
        description: intro,
      });
    } catch (error) {
      setResult({ error: '识别失败，请重试。' });
      message.error('API 请求失败，请检查网络或API Key');
      console.error('API error:', error?.response?.data || error);
    } finally {
      setImageUrl(URL.createObjectURL(file));
      setLoading(false);
    }
  };

  const handleReset = () => {
    setImageUrl(null);
    setResult(null);
    setLoading(false);
  };

  return (
    <div className="p-6 grid gap-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-center">🌿 植物识别 Demo</h1>
      <Card>
        <CardContent className="grid gap-4">
          <Upload.Dragger
            name="file"
            multiple={false}
            customRequest={handleUpload}
            accept="image/*"
            showUploadList={false}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="text-base">点击或拖拽图片进行植物识别</p>
          </Upload.Dragger>

          {loading && <Spin size="large" />}

          {imageUrl && (
            <div className="grid gap-2">
              <h2 className="text-lg font-semibold">上传的图片：</h2>
              <Image width={200} src={imageUrl} alt="uploaded plant" />
            </div>
          )}

          {result && (
            <div className="grid gap-2">
              <h2 className="text-lg font-semibold">识别结果：</h2>
              {result.error ? (
                <p className="text-red-500">{result.error}</p>
              ) : (
                <div>
                  <p>🌱 物种名称：{result.name}</p>
                  <p>📖 简介：<br />{result.description.split('\n').map((line, i) => <span key={i} dangerouslySetInnerHTML={{ __html: line }} />)}</p>
                </div>
              )}
            </div>
          )}

          {(imageUrl || result) && (
            <Button variant="outline" onClick={handleReset}>
              重置
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

const root = createRoot(document.getElementById("root"));
root.render(<PlantIdentifier />);
