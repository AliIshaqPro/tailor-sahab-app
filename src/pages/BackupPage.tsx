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
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center py-6">
        <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-2xl mb-4">
          <Database className="w-12 h-12 text-primary" />
        </div>
        <h1 className="text-2xl md:text-3xl font-urdu font-bold text-foreground mb-2">
          ڈیٹا بیک اپ
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          اپنے تمام گاہکوں اور آرڈرز کا بیک اپ لیں تاکہ آپ کا ڈیٹا محفوظ رہے
        </p>
      </div>

      {/* Backup Options */}
      <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {/* Download Backup */}
        <Card className="elevated-card">
          <CardHeader>
            <div className="bg-success/10 p-3 rounded-xl w-fit mb-2">
              <Download className="w-8 h-8 text-success" />
            </div>
            <CardTitle className="text-xl font-urdu">
              ڈاؤن لوڈ کریں
            </CardTitle>
            <CardDescription className="text-base">
              بیک اپ فائل اپنے فون یا کمپیوٹر میں محفوظ کریں
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleDownload}
              disabled={isDownloading}
              className="w-full h-14 text-lg bg-success hover:bg-success/90 text-success-foreground"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                  ڈاؤن لوڈ ہو رہا ہے...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5 ml-2" />
                  JSON فائل ڈاؤن لوڈ کریں
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Share via WhatsApp */}
        <Card className="elevated-card">
          <CardHeader>
            <div className="bg-[#25D366]/10 p-3 rounded-xl w-fit mb-2">
              <MessageCircle className="w-8 h-8 text-[#25D366]" />
            </div>
            <CardTitle className="text-xl font-urdu">
              واٹس ایپ پر بھیجیں
            </CardTitle>
            <CardDescription className="text-base">
              بیک اپ کی تفصیلات واٹس ایپ پر شیئر کریں
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleWhatsAppShare}
              disabled={isSharing}
              className="w-full h-14 text-lg bg-[#25D366] hover:bg-[#25D366]/90 text-white"
            >
              {isSharing ? (
                <>
                  <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                  بھیج رہا ہے...
                </>
              ) : (
                <>
                  <MessageCircle className="w-5 h-5 ml-2" />
                  واٹس ایپ پر بھیجیں
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Info */}
      <Card className="elevated-card max-w-3xl mx-auto">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="bg-accent/20 p-2 rounded-lg">
              <Shield className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">
                بیک اپ کیوں ضروری ہے؟
              </h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  • آپ کا ڈیٹا محفوظ رہتا ہے
                </li>
                <li className="flex items-center gap-2">
                  • کسی بھی مسئلے کی صورت میں ڈیٹا واپس لایا جا سکتا ہے
                </li>
                <li className="flex items-center gap-2">
                  • ہفتے میں کم از کم ایک بار بیک اپ لینا چاہیے
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
