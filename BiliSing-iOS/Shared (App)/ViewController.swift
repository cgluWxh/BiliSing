//
//  ViewController.swift
//  Shared (App)
//
//  Created by cgluWxh on 2025/7/25.
//

import WebKit
import os.log

import UIKit
typealias PlatformViewController = UIViewController

class ViewController: PlatformViewController, WKNavigationDelegate, WKScriptMessageHandler {

    @IBOutlet var webView: WKWebView!
    
    override var prefersStatusBarHidden: Bool { return true }
    override var editingInteractionConfiguration: UIEditingInteractionConfiguration { return .none }
    override var preferredScreenEdgesDeferringSystemGestures: UIRectEdge { return .all }
    override var canBecomeFirstResponder: Bool { return true }
    override func motionEnded(_ motion: UIEvent.EventSubtype, with event: UIEvent?) {
            if motion == .motionShake {/* 就不給你撤銷 */}
    }
    
    override func viewDidAppear(_ animated: Bool) {
        super.viewDidAppear(animated);
        // 隐藏导航条等
        self.becomeFirstResponder()
        self.navigationController?.navigationBar.isHidden = true
        self.navigationController?.navigationBar.setBackgroundImage(UIImage(), for: .default)
        self.navigationController?.navigationBar.shadowImage = UIImage()
    }
    
//    func webView(_ webView: WKWebView,
//            runJavaScriptAlertPanelWithMessage message: String,
//            initiatedByFrame frame: WKFrameInfo,
//            completionHandler: @escaping () -> Void) {
//            
//            // Set the message as the UIAlertController message
//            let alert = UIAlertController(
//                title: nil,
//                message: message,
//                preferredStyle: .alert
//            )
//
//            // Add a confirmation action “OK”
//            let okAction = UIAlertAction(
//                title: "OK",
//                style: .default,
//                handler: { _ in
//                    // Call completionHandler
//                    completionHandler()
//                }
//            )
//            alert.addAction(okAction)
//
//            // Display the NSAlert
//            present(alert, animated: true, completion: nil)
//        }
//        // Handle javascript: `window.confirm(message: String)`
//        func webView(_ webView: WKWebView,
//            runJavaScriptConfirmPanelWithMessage message: String,
//            initiatedByFrame frame: WKFrameInfo,
//            completionHandler: @escaping (Bool) -> Void) {
//
//            // Set the message as the UIAlertController message
//            let alert = UIAlertController(
//                title: nil,
//                message: message,
//                preferredStyle: .alert
//            )
//            
//            // Add a confirmation action “Cancel”
//            let cancelAction = UIAlertAction(
//                title: "Cancel",
//                style: .cancel,
//                handler: { _ in
//                    // Call completionHandler
//                    completionHandler(false)
//                }
//            )
//            
//            // Add a confirmation action “OK”
//            let okAction = UIAlertAction(
//                title: "OK",
//                style: .default,
//                handler: { _ in
//                    // Call completionHandler
//                    completionHandler(true)
//                }
//            )
//            alert.addAction(cancelAction)
//            alert.addAction(okAction)
//
//            // Display the NSAlert
//            present(alert, animated: true, completion: nil)
//        }
//        // Handle javascript: `window.prompt(prompt: String, defaultText: String?)`
//        func webView(_ webView: WKWebView,
//            runJavaScriptTextInputPanelWithPrompt prompt: String,
//            defaultText: String?,
//            initiatedByFrame frame: WKFrameInfo,
//            completionHandler: @escaping (String?) -> Void) {
//
//            // Set the message as the UIAlertController message
//            let alert = UIAlertController(
//                title: nil,
//                message: prompt,
//                preferredStyle: .alert
//            )
//            
//            // Add a confirmation action “Cancel”
//            let cancelAction = UIAlertAction(
//                title: "Cancel",
//                style: .cancel,
//                handler: { _ in
//                    // Call completionHandler
//                    completionHandler(nil)
//                }
//            )
//            
//            // Add a confirmation action “OK”
//            let okAction = UIAlertAction(
//                title: "OK",
//                style: .default,
//                handler: { _ in
//                    // Call completionHandler with Alert input
//                    if let input = alert.textFields?.first?.text {
//                        completionHandler(input)
//                    }
//                }
//            )
//            
//            alert.addTextField { textField in
//                textField.placeholder = defaultText
//            }
//            alert.addAction(cancelAction)
//            alert.addAction(okAction)
//
//            // Display the NSAlert
//            present(alert, animated: true, completion: nil)
//        }

    override func viewDidLoad() {
        super.viewDidLoad()

        self.webView.navigationDelegate = self

//        self.webView.scrollView.isScrollEnabled = false+
        let config = self.webView.configuration;
        config.allowsInlineMediaPlayback = true;
        config.mediaTypesRequiringUserActionForPlayback = [];
        config.allowsAirPlayForMediaPlayback = true;
//        config.allowsInlinePredictions = true;
        config.allowsPictureInPictureMediaPlayback = true;
        config.websiteDataStore = WKWebsiteDataStore.default();
        config.preferences.javaScriptCanOpenWindowsAutomatically = true;
        config.defaultWebpagePreferences.allowsContentJavaScript = true;
        webView.customUserAgent = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Safari/605.1.15"
        webView.scrollView.contentInsetAdjustmentBehavior = .never;

        config.userContentController.add(self, name: "controller")
    

        self.webView.loadFileURL(Bundle.main.url(forResource: "Main", withExtension: "html")!, allowingReadAccessTo: Bundle.main.resourceURL!)
    }

    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
//        webView.evaluateJavaScript("show('ios')")
    }
    
    func loadUserScriptAndEnterRoom(from urlString: String, enterUrl: String) {
        guard let url = URL(string: urlString) else { return }

        // 下载脚本内容
        URLSession.shared.dataTask(with: url) { data, response, error in
            guard let data = data,
                  let scriptSource = String(data: data, encoding: .utf8),
                  error == nil else {
                print("Failed to load script: \(error?.localizedDescription ?? "Unknown error")")
                return
            }

            DispatchQueue.main.async {
                print(scriptSource)
                // 构造 WKUserScript
                let userScript = WKUserScript(
                    source: scriptSource,
                    injectionTime: .atDocumentStart,
                    forMainFrameOnly: true
                )

                self.webView.configuration.userContentController.addUserScript(userScript);

                // 加载网页
                if let url = URL(string: enterUrl) {
                    let request = URLRequest(url: url)
                    self.webView.load(request)
                }
            }
        }.resume()
    }

    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        let msg = message.body as! String;
        let splitted = msg.split(separator: "$").map { String($0) };
        self.loadUserScriptAndEnterRoom(from: splitted[1], enterUrl: "https://bilibili.com/?bilising-room-id=" + splitted[0]);
    }

}
