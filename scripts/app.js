document.addEventListener('DOMContentLoaded', function() {
    const imageInput = document.getElementById('imageInput');
    const originalImage = document.getElementById('originalImage');
    const resultCanvas = document.getElementById('resultCanvas');
    const downloadButton = document.getElementById('downloadButton');
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const closeButton = document.querySelector('.close-button');

    // 处理图片上传
    imageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const img = new Image();
                img.onload = function() {
                    // 显示原图
                    originalImage.src = event.target.result;
                    // 生成四方连续图
                    createSeamlessPattern(img);
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // 创建四方连续图
    function createSeamlessPattern(img) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // 设置画布大小为原图尺寸
        canvas.width = img.width;
        canvas.height = img.height;

        // 步骤1：创建左右连续图
        const horizontalCanvas = document.createElement('canvas');
        horizontalCanvas.width = img.width;
        horizontalCanvas.height = img.height;
        const hCtx = horizontalCanvas.getContext('2d');
        
        // 绘制右半部分
        hCtx.drawImage(img, img.width/2, 0, img.width/2, img.height,
                           0, 0, img.width/2, img.height);
        // 绘制左半部分
        hCtx.drawImage(img, 0, 0, img.width/2, img.height,
                           img.width/2, 0, img.width/2, img.height);

        // 步骤2：创建上下连续图
        const verticalCanvas = document.createElement('canvas');
        verticalCanvas.width = img.width;
        verticalCanvas.height = img.height;
        const vCtx = verticalCanvas.getContext('2d');
        
        // 绘制下半部分
        vCtx.drawImage(horizontalCanvas, 0, img.height/2, img.width, img.height/2,
                                       0, 0, img.width, img.height/2);
        // 绘制上半部分
        vCtx.drawImage(horizontalCanvas, 0, 0, img.width, img.height/2,
                                       0, img.height/2, img.width, img.height/2);

        // 步骤3：创建四方连续图
        const size = img.width / 2;
        // 左上
        ctx.drawImage(verticalCanvas, 0, 0, img.width, img.height,
                                    0, 0, size, size);
        // 右上
        ctx.drawImage(verticalCanvas, 0, 0, img.width, img.height,
                                    size, 0, size, size);
        // 左下
        ctx.drawImage(verticalCanvas, 0, 0, img.width, img.height,
                                    0, size, size, size);
        // 右下
        ctx.drawImage(verticalCanvas, 0, 0, img.width, img.height,
                                    size, size, size, size);

        // 显示结果
        resultCanvas.width = img.width;
        resultCanvas.height = img.height;
        resultCanvas.getContext('2d').drawImage(canvas, 0, 0);
        
        // 启用下载按钮
        downloadButton.disabled = false;
    }

    // 处理图片下载
    downloadButton.addEventListener('click', function() {
        const link = document.createElement('a');
        link.download = '四方连续图.png';
        link.href = resultCanvas.toDataURL('image/png');
        link.click();
    });

    // 处理图片预览
    resultCanvas.addEventListener('click', function() {
        modal.style.display = 'block';
        modalImage.src = resultCanvas.toDataURL();
    });

    originalImage.addEventListener('click', function() {
        if (this.src) {
            modal.style.display = 'block';
            modalImage.src = this.src;
        }
    });

    // 关闭模态框
    closeButton.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}); 