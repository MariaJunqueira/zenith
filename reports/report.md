# Performance Report

## Introduction

Live version available [here](https://zenith-3c5dc.web.app/users)

### Goal

👉 Given an initial application that consumes a public Users API and displays them in a list, your task is to implement all the requirements detailed below. The main goal of this challenge is to improve the performance and add missing features to the existing application.

## Initial Performance Overview

### Original Performance Issues

As part of the assessment, I conducted an initial performance analysis of the provided codebase, which revealed several significant issues that needed to be addressed:

#### DevTools Performance Summary

Here’s a quick summary of what I found when profiling the site using Chrome DevTools:

- **Loading:** 6 ms
- **Scripting:** 1989 ms
- **Rendering:** 476 ms
- **Painting:** 852 ms
- **System:** 297 ms
- **Idle:** 1550 ms
- **Total Time:** 5171 ms

The profiling revealed that a significant amount of time was being spent on scripting, which slowed down the overall performance. The total load time of over 5 seconds was a key indicator of inefficiencies in the codebase.

#### Key Metrics

The key web performance metrics also highlighted areas of concern:

- **LCP (Largest Contentful Paint):** 117.35 ms
- **FP (First Paint):** 117.35 ms
- **FCP (First Contentful Paint):** 117.35 ms
- **L (Load):** 134 ms

These metrics, although initially looking promising, were overshadowed by the lengthy scripting and total load times, which resulted in a less-than-optimal user experience.

#### Lighthouse and Pagespeed Failures

Attempts to generate reports using Lighthouse and Pagespeed were unsuccessful. Lighthouse couldn’t complete the audit, and Pagespeed returned an error, indicating severe performance issues that prevented these tools from analyzing the site properly. [Pagespeed Results](https://pagespeed.web.dev/analysis/https-zenith-3c5dc-web-app/2haiatlv02?form_factor=mobile).

#### Memory Usage

The memory usage was another area of concern:

- **Snapshot (Before):** 690 MB
- **Top Retained Size Objects:**
  - **Object (x23684):**
    - Shallow Size: 717,884 bytes
    - Retained Size: 672,213,760 bytes (97%)
  - **Array (x46085):**
    - Shallow Size: 737,360 bytes
    - Retained Size: 671,654,380 bytes (97%)
  - **(array) (x47603):**
    - Shallow Size: 670,495,256 bytes
    - Retained Size: 671,283,436 bytes (97%)
  - **Function (x26935):**
    - Shallow Size: 815,084 bytes
    - Retained Size: 3,599,544 bytes (1%)
  - **HTMLParagraphElement (x20003):**
    - Shallow Size: 2,400,060 bytes
    - Retained Size: 2,400,356 bytes

This large memory retention, primarily from arrays and objects, suggested potential memory leaks or inefficient data handling, which contributed to the overall performance degradation.

## Solutions Applied for Performance Improvement

To address the identified issues, I implemented a series of optimizations aimed at improving the application’s performance and user experience:

### 1. Moving Logic Outside of App Components

I refactored the code by moving heavy logic out of the main app components. This change reduced the load on the UI thread, leading to faster rendering times and a more responsive user interface. Additionally, this modular approach improved the maintainability and readability of the code.

### 2. Adding Web Worker for User Grouping

To handle the categorization of user groups more efficiently, I introduced a Web Worker. This offloaded intensive processing from the main thread, allowing the UI to remain smooth and responsive, even when managing large datasets. The grouping logic was also moved from the list component to the page level, optimizing the overall data flow.

### 3. Implementing Lazy Loading for Profile Images

I added lazy loading for profile images, ensuring that images are only loaded as they enter the viewport. This significantly reduced the initial page load time and improved performance, particularly on mobile devices where network conditions may vary.

### 4. Adding Infinite Scroll

To address the performance hit from rendering a large number of users simultaneously, I implemented an infinite scroll feature. This approach allows users to load more content as they scroll, rather than all at once, which reduces the initial rendering time and overall memory usage.

### 5. Basic Caching and Loading Logic

I incorporated basic caching mechanisms and loading indicators to optimize resource usage and improve the user experience. This reduced the number of redundant network requests and provided a smoother interaction experience.

### 6. Removing Duplicate CSS and Optimizing Styles

To improve CSS performance and maintainability, I removed duplicate CSS from the `_typography.scss` file, preventing unnecessary overwrites. Additionally, I delegated the responsibility for setting HTML and BODY styles to the `ease-styles.scss` file, which streamlined the style management across the application.

### 7. Avoiding the `*` Selector in CSS

I also removed the use of the `*` selector in the CSS, which can negatively impact performance by applying styles indiscriminately to all elements on the page. By avoiding this selector, the application now processes styles more efficiently, reducing the overall load on the browser’s rendering engine.

## Updated Performance Metrics

### After Optimization

Following the optimizations, I observed significant improvements across various performance metrics:

#### Memory Usage (After)

- **Snapshot (After):** 17.5 MB
- **Top Retained Size Objects:**
  - **Array (x2125):**
    - Shallow Size: 34,000 bytes
    - Retained Size: 10,722,684 bytes (61%)
  - **Object (x64319):**
    - Shallow Size: 522,104 bytes
    - Retained Size: 9,845,236 bytes (56%)
  - **(string) (x248404):**
    - Shallow Size: 7,935,932 bytes
    - Retained Size: 7,935,932 bytes (45%)
  - **(compiled code) (x41764):**
    - Shallow Size: 9,168 bytes
    - Retained Size: 5,314,888 bytes (30%)
  - **HTMLDivElement (x82):**
    - Shallow Size: 632 bytes
    - Retained Size: 34,424 bytes (0%)

The memory usage was significantly reduced, bringing the snapshot down to 17.5 MB from the previous 690 MB. The optimizations applied to array and object handling greatly reduced retained memory, improving the overall efficiency of the application.

#### DevTools Performance Summary (After)

Here’s a quick summary of the performance metrics after optimization:

- **Loading:** 6 ms
- **Scripting:** 136 ms
- **Rendering:** 20 ms
- **Painting:** 8 ms
- **System:** 50 ms
- **Idle:** 1850 ms
- **Total Time:** 2068 ms

These updated metrics show a dramatic reduction in total execution time, from 5171 ms to just 2068 ms. The most significant improvement was in the scripting time, which dropped from 1989 ms to 136 ms, highlighting the effectiveness of the optimizations implemented.

#### Lighthouse Report

- **Performance:** 97
- **Accessibility:** 100
- **Best Practices:** 96
- **SEO:** 100
- **Key Metrics:**
  - **First Contentful Paint (FCP):** 1.2 s
  - **Largest Contentful Paint (LCP):** 1.3 s
  - **Total Blocking Time (TBT):** 180 ms
  - **Cumulative Layout Shift (CLS):** 0
  - **Speed Index (SI):** 1.2 s

The Lighthouse scores improved dramatically across the board, with performance nearing the maximum score and significant improvements in FCP, LCP, TBT, and SI.

#### Pagespeed Report

- **Performance:** 85
- **Accessibility:** 100
- **Best Practices:** 100
- **SEO:** 85
- **Key Metrics:**
  - **First Contentful Paint (FCP):** 1.3 s
  - **Largest Contentful Paint (LCP):** 1.4 s
  - **Total Blocking Time (TBT):** 460 ms
  - **Cumulative Layout Shift (CLS):** 0.057
  - **Speed Index (SI):** 4.3 s

The Pagespeed report also shows marked improvements, particularly in performance-related metrics, though there is still room for further optimization.

## Conclusion

The optimizations applied resulted in substantial improvements in the overall performance and user experience of the application. The memory usage was drastically reduced, and the key performance metrics such as FCP, LCP, and TBT showed significant enhancements.

### Additional Improvements to Consider

Given more time, I would have implemented the following additional features to further enhance the application:

- **Handling empty search results:** Providing feedback to the user when no results match the search query.
- **Adding `updateVisibleUsers` to the worker:** Offloading more processing to the Web Worker for better performance.
- **Error handling:** Implementing robust error handling across the application to improve reliability.
- **Windowing for infinite scroll:** Implementing windowing in my solution to further optimize the rendering of large lists.
- **Last updated:** Add visual element with last time where the cache was updated.

