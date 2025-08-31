# **Visual Product Matcher**

This is a web application that allows users to find visually similar products based on an uploaded image or URL. It was built as a technical assessment for a software engineering position at Unthinkable Solutions.

## **Features**

* **Image Upload:** Users can upload a product image from their local machine or provide a public URL. The application uses Next.js's built-in image optimization to ensure a fast and responsive experience.  
* **Visual Search:** The application's core functionality is a visual search algorithm that uses machine learning to find products that are visually similar to the uploaded image.  
* **Similarity Scoring:** Each product in the search results is displayed with a similarity score, indicating how closely it matches the input image.  
* **Responsive Design:** The user interface is built with Tailwind CSS and is fully responsive, providing a consistent experience on both desktop and mobile devices.

## **Technology Stack**

* **Frontend:** Next.js with React and TypeScript.  
* **Backend:** Next.js API Routes.  
* **Styling:** Tailwind CSS for a modern and attractive UI.  
* **Machine Learning:** TensorFlow.js with a pre-trained MobileNet model for image feature extraction and a custom cosine similarity function for matching.  
* **Data:** Mock product data stored in a JSON file for a simple and effective database solution.  
* **Deployment:** The application is designed for easy, zero-configuration deployment on Vercel.

## **Technical Approach**

The core of this application is a **visual matching algorithm** that I implemented on the backend using a Next.js API route. When a user provides an image, the application does the following:

1. **Image Processing**: The input image is pre-processed and resized to a standard size (224x224 pixels) to match the dimensions expected by the machine learning model.  
2. **Embedding Generation**: A pre-trained **MobileNet** model from the **TensorFlow.js** library is used to convert the processed image into a high-dimensional numerical vector, known as an **embedding**. This embedding acts as a unique "visual fingerprint" for the image.  
3. **Similarity Search**: The application compares this new embedding to the pre-computed embeddings of all the products in the mock database.  
4. **Cosine Similarity**: A **cosine similarity** function is used to calculate the similarity between the vectors. This mathematical calculation returns a score between 0 and 1, with a higher score indicating a closer visual match.  
5. **Result Display**: The products are then sorted by their similarity score in descending order, and the top results are returned to the frontend for display.

This approach ensures that the application is efficient, scalable, and accurately solves the core problem of visual product matching.

## **Setup and Running**

1. **Clone the repository:**  
   git clone https://github.com/Kushal-Pandey18/Visual-Product-Matcher

2. **Install dependencies:**  
   npm install

3. **Run the development server:**  
   npm run dev

The application will be available at http://localhost:3000.