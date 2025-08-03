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
      // mock 返回
      await new Promise(r => setTimeout(r, 1000));
      setResult({
        name: "测试植物",
        description: "这是一个测试描述。",
      });
      // 实际使用时请恢复为你的后端接口
      // const response = await axios.post('你的后端接口地址', formData);
      // setResult(response.data);
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
