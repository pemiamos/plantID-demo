import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, Image, Spin } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import axios from 'axios';

function PlantIdentifier() {
  const [imageUrl, setImageUrl] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async ({ file }) => {
    setLoading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post(
        'https://plant.id/api/v3/identify',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Api-Key': 'XCYFzewGYhsOqYewjCPSoKZIWAmrQZoCvc6ul7zlmhf9wgqvnC', // 这里替换为你的实际 API Key
          },
        }
      );
      setResult(response.data);
    } catch (error) {
      setResult({ error: '识别失败，请重试。' });
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
