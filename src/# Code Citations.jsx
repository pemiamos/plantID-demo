# Code Citations

## License: unknown
https://github.com/vielhuber/hlp/tree/72775f7c094b95e6d249434230b4a72fe586f425/_js/_build/script.js

```
) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = error => reject(error)
```


## License: unknown
https://github.com/MatheusAlvesA/funcionarios_paytour_frontend/tree/c0b06121b329a9f1acc2bda8e9b4946cc33ad017/src/CadastrarFuncionario/index.jsx

```
= file =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(',')[1]);
```


## License: unknown
https://github.com/midhunxavier/convertany/tree/992f6e9aba613a63d9025901915882baed1ad462/web/js/script.js

```
file =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader
```

# plant_id_demo.jsx

以下是调用 Wikipedia API 的完整实现，直接修改项目代码以支持通过拉丁学名查询 Wikipedia 的内容。

```jsx
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
      if (plantName) {
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
      intro += `百科：${wikiSummary}`;

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
```

```jsx
                  <p>📖 简介：<br />{result.description.split('\n').map((line, i) => <span key={i}>{line}<br/></span>)}</p>
```