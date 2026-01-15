import { useState } from 'react';
import { useBackup } from '@/hooks/useBackup';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, MessageCircle, Database, Shield, Loader2 } from 'lucide-react';

export default function BackupPage() {
  const { downloadBackup, shareViaWhatsApp } = useBackup();
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await downloadBackup();
    } catch (error) {
      // Error handled in hook
    } finally {
      setIsDownloading(false);
    }
  };

  const handleWhatsAppShare = async () => {
    setIsSharing(true);
    try {
      await shareViaWhatsApp();
    } catch (error) {
      // Error handled in hook
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="text-center py-4">
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-3">
          <Database className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-xl font-urdu font-bold text-foreground mb-1">
          ڈیٹا بیک اپ
        </h1>
        <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
          اپنے تمام گاہکوں اور آرڈرز کا بیک اپ لیں
        </p>
      </div>

      {/* Backup Options */}
      <div className="space-y-4">
        {/* Download Backup */}
        <Card className="elevated-card">
          <CardHeader className="pb-3 pt-4 px-4">
            <div className="flex items-center gap-3">
              <div className="bg-success/10 p-2.5 rounded-xl shrink-0">
                <Download className="w-6 h-6 text-success" />
              </div>
              <div className="min-w-0">
                <CardTitle className="text-base font-urdu">
                  ڈاؤن لوڈ کریں
                </CardTitle>
                <CardDescription className="text-xs">
                  بیک اپ فائل فون میں محفوظ کریں
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <Button
              onClick={handleDownload}
              disabled={isDownloading}
              className="w-full h-12 text-sm bg-success hover:bg-success/90 text-success-foreground"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                  ڈاؤن لوڈ ہو رہا ہے...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 ml-2" />
                  JSON فائل ڈاؤن لوڈ
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Share via WhatsApp */}
        <Card className="elevated-card">
          <CardHeader className="pb-3 pt-4 px-4">
            <div className="flex items-center gap-3">
              <div className="bg-[#25D366]/10 p-2.5 rounded-xl shrink-0">
                <MessageCircle className="w-6 h-6 text-[#25D366]" />
              </div>
              <div className="min-w-0">
                <CardTitle className="text-base font-urdu">
                  واٹس ایپ
                </CardTitle>
                <CardDescription className="text-xs">
                  بیک اپ واٹس ایپ پر بھیجیں
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <Button
              onClick={handleWhatsAppShare}
              disabled={isSharing}
              className="w-full h-12 text-sm bg-[#25D366] hover:bg-[#25D366]/90 text-white"
            >
              {isSharing ? (
                <>
                  <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                  بھیج رہا ہے...
                </>
              ) : (
                <>
                  <MessageCircle className="w-4 h-4 ml-2" />
                  واٹس ایپ پر بھیجیں
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Info */}
      <Card className="elevated-card">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="bg-accent/20 p-2 rounded-lg shrink-0">
              <Shield className="w-5 h-5 text-accent" />
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-foreground text-sm mb-2">
                بیک اپ کیوں ضروری ہے؟
              </h3>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                <li>• آپ کا ڈیٹا محفوظ رہتا ہے</li>
                <li>• مسئلے کی صورت میں ڈیٹا واپس لائیں</li>
                <li>• ہفتے میں کم از کم ایک بار بیک اپ لیں</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
