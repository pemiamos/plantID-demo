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

    // 将图片文件转为 base64
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
      console.log('API response:', response.data); // 打印API返回内容
      const suggestion = response.data?.suggestions?.[0];
      setResult({
        name: suggestion?.plant_name || '未识别到植物',
        description: suggestion?.plant_details?.wiki_description?.value || '暂无简介',
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
                  <p>📖 简介：{result.description}</p>
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
